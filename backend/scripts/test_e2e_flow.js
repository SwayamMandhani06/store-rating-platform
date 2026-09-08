const API_BASE = 'http://localhost:5000/api';

async function request(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runTest() {
  console.log('=== STARTING 14-STEP END-TO-END VERIFICATION FLOW ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // Step 1: Admin login
    console.log('Step 1: Admin Login with Indian Seed Account');
    const adminRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@storerating.com', password: 'Admin@1234' },
    });
    assert(adminRes.status === 200 && adminRes.data?.token, 'Admin login succeeded');
    const adminToken = adminRes.data.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    // Step 2: Admin creates a new Store Owner with authentic Indian name (20-60 chars)
    console.log('\nStep 2: Admin creates Store Owner (Indian name > 20 chars)');
    const ownerName = 'Venkateshwara Rao Somayajula'; // 28 chars
    const ownerEmail = `venkat.${Date.now()}@gmail.com`;
    const newOwnerRes = await request('/admin/users', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        name: ownerName,
        email: ownerEmail,
        password: 'Password@123',
        address: 'Banjara Hills Road No 12, Hyderabad, Telangana 500034',
        role: 'owner',
      },
    });
    assert(newOwnerRes.status === 201 && (newOwnerRes.data.id || newOwnerRes.data.user?.id), `Created owner: ${ownerName}`);
    const createdOwnerId = newOwnerRes.data.id || newOwnerRes.data.user?.id;

    // Step 3: Admin creates a Store assigned to that Store Owner
    console.log('\nStep 3: Admin creates Store assigned to Owner');
    const storeName = `Dakshin Spices Emporium ${Date.now() % 1000}`;
    const newStoreRes = await request('/admin/stores', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        name: storeName,
        email: `contact.${Date.now()}@dakshin.com`,
        address: 'MG Road, Secunderabad, Telangana 500003',
        ownerId: createdOwnerId,
      },
    });
    assert(newStoreRes.status === 201 && newStoreRes.data.id, `Created store: ${storeName}`);
    const createdStoreId = newStoreRes.data.id;

    // Step 4: Normal User signup with authentic Indian name
    console.log('\nStep 4: Normal User Signup (authentic Indian name, 20-60 chars)');
    const userName = 'Subramanian Kalyanasundaram'; // 27 chars
    const userEmail = `subbu.${Date.now()}@gmail.com`;
    const userPw = 'Subbu@2024';
    const signupRes = await request('/auth/signup', {
      method: 'POST',
      body: {
        name: userName,
        email: userEmail,
        password: userPw,
        address: 'Anna Nagar West Extension, Chennai, Tamil Nadu 600101',
      },
    });
    assert(signupRes.status === 201 && signupRes.data?.token, `Signed up reviewer: ${userName}`);
    const userToken = signupRes.data.token;
    const userHeaders = { Authorization: `Bearer ${userToken}` };

    // Step 5: Normal User browses and searches stores
    console.log('\nStep 5: User browses and searches stores');
    const browseRes = await request(`/stores?name=${encodeURIComponent(storeName.slice(0, 10))}`, {
      headers: userHeaders,
    });
    assert(browseRes.status === 200 && Array.isArray(browseRes.data), 'Store search returned results');
    const foundStore = browseRes.data.find((s) => s.id === createdStoreId);
    assert(!!foundStore, `Found created store in search results`);

    // Step 6: User submits rating (5 stars)
    console.log('\nStep 6: User submits 5-star rating');
    const rateRes = await request(`/stores/${createdStoreId}/ratings`, {
      method: 'POST',
      headers: userHeaders,
      body: { rating: 5 },
    });
    assert(rateRes.status === 200 || rateRes.status === 201, '5-star rating submitted');

    // Step 7: User modifies rating (changes from 5 to 4 stars)
    console.log('\nStep 7: User modifies rating to 4 stars');
    const modifyRateRes = await request(`/stores/${createdStoreId}/ratings`, {
      method: 'POST',
      headers: userHeaders,
      body: { rating: 4 },
    });
    assert(modifyRateRes.status === 200, 'Rating successfully updated to 4 stars');

    // Step 8: User changes password
    console.log('\nStep 8: User changes password');
    const newPw = 'NewSubbu@2025';
    const changePwRes = await request('/auth/password', {
      method: 'PUT',
      headers: userHeaders,
      body: { currentPassword: userPw, newPassword: newPw },
    });
    assert(changePwRes.status === 200, 'Password updated successfully');

    // Verify login with new password
    const reLoginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: userEmail, password: newPw },
    });
    assert(reLoginRes.status === 200 && reLoginRes.data?.token, 'Login with updated password succeeded');

    // Step 9: Store Owner logs in and checks Owner Dashboard
    console.log('\nStep 9: Store Owner checks Dashboard analytics');
    const ownerLoginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: ownerEmail, password: 'Password@123' },
    });
    const ownerToken = ownerLoginRes.data?.token;
    const ownerHeaders = { Authorization: `Bearer ${ownerToken}` };
    const ownerDashRes = await request('/owner/dashboard', {
      headers: ownerHeaders,
    });
    assert(ownerDashRes.status === 200 && ownerDashRes.data?.store, 'Owner dashboard loaded successfully');
    assert(
      ownerDashRes.data.raters.some((r) => r.user?.email === userEmail),
      'Reviewer appears in owner raters table'
    );

    // Step 10: Admin inspects User Detail
    console.log('\nStep 10: Admin inspects User Detail');
    const userDetailRes = await request(`/admin/users/${createdOwnerId}`, {
      headers: adminHeaders,
    });
    assert(userDetailRes.status === 200 && userDetailRes.data?.store, 'Admin retrieved owner detail with store');

    // Step 11: Admin filter and sort
    console.log('\nStep 11: Admin filters and sorts');
    const usersSortRes = await request('/admin/users?sortBy=name&order=asc&role=owner', {
      headers: adminHeaders,
    });
    assert(usersSortRes.status === 200 && usersSortRes.data.length > 0, 'Admin filtered owners list sorted by name');

    const storesSortRes = await request('/admin/stores?sortBy=name&order=desc', {
      headers: adminHeaders,
    });
    assert(storesSortRes.status === 200 && storesSortRes.data.length > 0, 'Admin stores list sorted desc');

    // Step 12: Role-Permission Blocking Verification
    console.log('\nStep 12: Role-Permission Blocking (RBAC)');
    const blockedUserAdmin = await request('/admin/users', { headers: userHeaders });
    assert(blockedUserAdmin.status === 403, 'Normal user blocked from /admin/users with 403');

    const blockedUserOwner = await request('/owner/dashboard', { headers: userHeaders });
    assert(blockedUserOwner.status === 403, 'Normal user blocked from /owner/dashboard with 403');

    const blockedOwnerAdmin = await request('/admin/users', { headers: ownerHeaders });
    assert(blockedOwnerAdmin.status === 403, 'Store owner blocked from /admin/users with 403');

    // Step 13: Store Breakdown modal endpoint
    console.log('\nStep 13: Store Breakdown & Rating Distribution endpoint');
    const breakdownRes = await request(`/stores/${createdStoreId}`, {
      headers: userHeaders,
    });
    assert(
      breakdownRes.status === 200 && breakdownRes.data?.distribution && breakdownRes.data.distribution[4] >= 1,
      'Breakdown endpoint returned 1★-5★ distribution correctly'
    );

    // Step 14: Verify Indian Seed accounts
    console.log('\nStep 14: Verifying pre-seeded Indian demo accounts');
    const seededOwnerRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'lakshmi.subramaniam@gmail.com', password: 'Owner@1234' },
    });
    assert(seededOwnerRes.status === 200 && seededOwnerRes.data.user.role === 'owner', 'Seeded Indian Store Owner login OK');

    const seededUserRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'sourav.dutta@gmail.com', password: 'User@1234' },
    });
    assert(seededUserRes.status === 200 && seededUserRes.data.user.role === 'user', 'Seeded Indian Normal User login OK');

    console.log('\n=================================================');
    console.log(`E2E TEST COMPLETE: ${passed} Passed, ${failed} Failed`);
    console.log('=================================================');
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test runtime error:', err);
    process.exit(1);
  }
}

runTest();
