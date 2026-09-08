require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Store, Rating } = require('../models');

async function seedDemo() {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
    }

    console.log('Seeding authentic Indian demo data into database...');

    // 1. Seed System Administrator
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@storerating.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';
    const adminHashed = await bcrypt.hash(adminPassword, 10);

    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await User.create({
        name: process.env.SEED_ADMIN_NAME || 'Rajeshwar Prasad Srivastava',
        email: adminEmail,
        password: adminHashed,
        address: process.env.SEED_ADMIN_ADDRESS || 'Connaught Place, Central Secretariat, New Delhi 110001',
        role: 'admin',
      });
      console.log(`[Admin] Created: ${admin.email}`);
    } else {
      console.log(`[Admin] Exists: ${admin.email}`);
    }

    // 2. Seed Store Owners & Stores (diverse Indian regions)
    const defaultOwnerPassword = await bcrypt.hash('Owner@1234', 10);
    const storeOwnersData = [
      {
        user: {
          name: 'Lakshmi Priya Subramaniam', // 25 chars (South)
          email: 'lakshmi.subramaniam@gmail.com',
          password: defaultOwnerPassword,
          address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
          role: 'owner',
        },
        store: {
          name: "Nair's South Indian Delicacies",
          email: 'contact@nairsdelicacies.in',
          address: '42 CMH Road, Indiranagar, Bengaluru, Karnataka 560038',
        },
      },
      {
        user: {
          name: 'Nileshkumar Rajesh Patel', // 24 chars (West / Gujarat)
          email: 'nilesh.patel@gmail.com',
          password: defaultOwnerPassword,
          address: 'Swastik Society, Navrangpura, Ahmedabad, Gujarat 380009',
          role: 'owner',
        },
        store: {
          name: 'Patel Electronics Emporium',
          email: 'support@patelelectronics.in',
          address: '15 Commercial Complex, CG Road, Ahmedabad, Gujarat 380009',
        },
      },
      {
        user: {
          name: 'Ananya Chattopadhyay Banerjee', // 29 chars (East / Bengal)
          email: 'ananya.banerjee@gmail.com',
          password: defaultOwnerPassword,
          address: 'Block CF, Sector 1, Salt Lake, Kolkata, West Bengal 700064',
          role: 'owner',
        },
        store: {
          name: 'Annapurna Sweets & Tiffin Center',
          email: 'orders@annapurnasweets.in',
          address: '78 Bidhan Sarani, Shyambazar, Kolkata, West Bengal 700004',
        },
      },
      {
        user: {
          name: 'Priyanka Deshmukh Joshi', // 23 chars (West / Maharashtra)
          email: 'priyanka.joshi@gmail.com',
          password: defaultOwnerPassword,
          address: 'Pali Hill, Bandra West, Mumbai, Maharashtra 400050',
          role: 'owner',
        },
        store: {
          name: 'Bandra Book Nook',
          email: 'books@bandrabooknook.in',
          address: '24 Hill Road, Bandra West, Mumbai, Maharashtra 400050',
        },
      },
      {
        user: {
          name: 'Harpreet Singh Chadha', // 21 chars (North / Punjab)
          email: 'harpreet.chadha@gmail.com',
          password: defaultOwnerPassword,
          address: 'Madhya Marg, Sector 18, Chandigarh, Punjab 160018',
          role: 'owner',
        },
        store: {
          name: 'Singh Automobile Workshop',
          email: 'service@singhauto.in',
          address: 'Plot 104 Industrial Area Phase 1, Chandigarh, Punjab 160002',
        },
      },
      {
        user: {
          name: 'Venkata Sai Krishna Reddy', // 25 chars (South / Telugu)
          email: 'krishna.reddy@gmail.com',
          password: defaultOwnerPassword,
          address: 'Road Number 12, Banjara Hills, Hyderabad, Telangana 500034',
          role: 'owner',
        },
        store: {
          name: 'Chettinad Spice House',
          email: 'flavour@chettinadspice.in',
          address: 'Plot 40 Jubilee Enclave, Hitec City, Hyderabad, Telangana 500081',
        },
      },
    ];

    const storeMap = new Map();

    for (const item of storeOwnersData) {
      let owner = await User.findOne({ where: { email: item.user.email } });
      if (!owner) {
        owner = await User.create(item.user);
        console.log(`[Store Owner] Created: ${owner.email} (${owner.name})`);
      } else {
        owner.name = item.user.name;
        owner.address = item.user.address;
        await owner.save();
        console.log(`[Store Owner] Updated/Exists: ${owner.email}`);
      }

      let store = await Store.findOne({ where: { email: item.store.email } });
      if (!store) {
        store = await Store.create({
          ...item.store,
          ownerId: owner.id,
        });
        console.log(`[Store] Created: "${store.name}" (Owner: ${owner.email})`);
      } else {
        store.name = item.store.name;
        store.address = item.store.address;
        store.ownerId = owner.id;
        await store.save();
        console.log(`[Store] Updated/Exists: "${store.name}"`);
      }
      storeMap.set(item.store.name, store);
    }

    // 3. Seed Normal Users (14 across various Indian states)
    const defaultUserPassword = await bcrypt.hash('User@1234', 10);
    const normalUsersData = [
      { name: 'Sourav Mukherjee Dutta', email: 'sourav.dutta@gmail.com', address: 'Park Street, Kolkata, West Bengal 700016' },
      { name: 'Ananya Kapoor Malhotra', email: 'ananya.malhotra@gmail.com', address: 'Greater Kailash 1, New Delhi, Delhi 110048' },
      { name: 'Rajeshwari Venkataraman Iyer', email: 'rajeshwari.iyer@gmail.com', address: 'Mylapore, Chennai, Tamil Nadu 600004' },
      { name: 'Vikramaditya Rao Deshmukh', email: 'vikram.deshmukh@gmail.com', address: 'Koregaon Park, Pune, Maharashtra 411001' },
      { name: 'Divya Meenakshi Sundaram', email: 'divya.sundaram@gmail.com', address: 'Anna Nagar West, Chennai, Tamil Nadu 600040' },
      { name: 'Rohan Preet Singh Bindra', email: 'rohan.bindra@gmail.com', address: 'Model Town, Ludhiana, Punjab 141002' },
      { name: 'Bhavna Shaileshbhai Mehta', email: 'bhavna.mehta@gmail.com', address: 'Vastrapur, Ahmedabad, Gujarat 380015' },
      { name: 'Kavita Chidambaram Chettiar', email: 'kavita.chettiar@gmail.com', address: 'T Nagar, Chennai, Tamil Nadu 600017' },
      { name: 'Abhishek Surendra Tiwari', email: 'abhishek.tiwari@gmail.com', address: 'Hazratganj, Lucknow, Uttar Pradesh 226001' },
      { name: 'Meenakshi Ramaswamy Pillai', email: 'meenakshi.pillai@gmail.com', address: 'Jayanagar 4th Block, Bengaluru, Karnataka 560011' },
      { name: 'Gaurav Shrikant Kulkarni', email: 'gaurav.kulkarni@gmail.com', address: 'Kothrud, Pune, Maharashtra 411038' },
      { name: 'Sunita Maheshwari Agarwal', email: 'sunita.agarwal@gmail.com', address: 'Vaishali Nagar, Jaipur, Rajasthan 302021' },
      { name: 'Tarun Jagdishwar Bhattacharya', email: 'tarun.bhattacharya@gmail.com', address: 'Ballygunge, Kolkata, West Bengal 700019' },
      { name: 'Pranav Venkatesh Namboodiri', email: 'pranav.namboodiri@gmail.com', address: 'Panampilly Nagar, Kochi, Kerala 682036' },
    ];

    const userMap = new Map();

    for (const u of normalUsersData) {
      let user = await User.findOne({ where: { email: u.email } });
      if (!user) {
        user = await User.create({
          name: u.name,
          email: u.email,
          password: defaultUserPassword,
          address: u.address,
          role: 'user',
        });
        console.log(`[Normal User] Created: ${user.email}`);
      } else {
        user.name = u.name;
        user.address = u.address;
        await user.save();
        console.log(`[Normal User] Updated/Exists: ${user.email}`);
      }
      userMap.set(u.email, user);
    }

    // 4. Seed Ratings with varied distribution
    const nairs = storeMap.get("Nair's South Indian Delicacies");
    const patel = storeMap.get('Patel Electronics Emporium');
    const annapurna = storeMap.get('Annapurna Sweets & Tiffin Center');
    const bandraBooks = storeMap.get('Bandra Book Nook');
    const singhAuto = storeMap.get('Singh Automobile Workshop');

    const ratingsPlan = [
      // Annapurna Sweets (Top tier, 5 reviews: ~4.80)
      { userEmail: 'sourav.dutta@gmail.com', storeId: annapurna.id, rating: 5 },
      { userEmail: 'ananya.malhotra@gmail.com', storeId: annapurna.id, rating: 5 },
      { userEmail: 'tarun.bhattacharya@gmail.com', storeId: annapurna.id, rating: 5 },
      { userEmail: 'rajeshwari.iyer@gmail.com', storeId: annapurna.id, rating: 4 },
      { userEmail: 'abhishek.tiwari@gmail.com', storeId: annapurna.id, rating: 5 },

      // Nair's South Indian Delicacies (High ratings, 5 reviews: ~4.60)
      { userEmail: 'divya.sundaram@gmail.com', storeId: nairs.id, rating: 5 },
      { userEmail: 'meenakshi.pillai@gmail.com', storeId: nairs.id, rating: 5 },
      { userEmail: 'pranav.namboodiri@gmail.com', storeId: nairs.id, rating: 5 },
      { userEmail: 'kavita.chettiar@gmail.com', storeId: nairs.id, rating: 4 },
      { userEmail: 'gaurav.kulkarni@gmail.com', storeId: nairs.id, rating: 4 },

      // Bandra Book Nook (Solid 4.00, 4 reviews)
      { userEmail: 'vikram.deshmukh@gmail.com', storeId: bandraBooks.id, rating: 4 },
      { userEmail: 'bhavna.mehta@gmail.com', storeId: bandraBooks.id, rating: 5 },
      { userEmail: 'sunita.agarwal@gmail.com', storeId: bandraBooks.id, rating: 4 },
      { userEmail: 'rohan.bindra@gmail.com', storeId: bandraBooks.id, rating: 3 },

      // Patel Electronics Emporium (Mixed 3.00, 4 reviews)
      { userEmail: 'bhavna.mehta@gmail.com', storeId: patel.id, rating: 3 },
      { userEmail: 'sunita.agarwal@gmail.com', storeId: patel.id, rating: 2 },
      { userEmail: 'gaurav.kulkarni@gmail.com', storeId: patel.id, rating: 4 },
      { userEmail: 'abhishek.tiwari@gmail.com', storeId: patel.id, rating: 3 },

      // Singh Automobile Workshop (Single review: 4.00)
      { userEmail: 'rohan.bindra@gmail.com', storeId: singhAuto.id, rating: 4 },

      // Chettinad Spice House (Hyderabad) has 0 reviews to test empty state
    ];

    let ratingsCreated = 0;
    for (const r of ratingsPlan) {
      const user = userMap.get(r.userEmail);
      if (!user || !r.storeId) continue;

      const [record, created] = await Rating.findOrCreate({
        where: { userId: user.id, storeId: r.storeId },
        defaults: { rating: r.rating },
      });
      if (created) ratingsCreated++;
    }

    console.log(`[Ratings] Inserted ${ratingsCreated} ratings.`);
    console.log('Indian demo data seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Indian demo data failed:', err);
    process.exit(1);
  }
}

seedDemo();
