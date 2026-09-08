require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Store, Rating } = require('../models');

async function seedDemo() {
  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
    }

    console.log('Seeding demo data into database...');

    // 1. Seed System Administrator
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@storerating.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@1234';
    const adminHashed = await bcrypt.hash(adminPassword, 10);

    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = await User.create({
        name: process.env.SEED_ADMIN_NAME || 'Default System Administrator Account',
        email: adminEmail,
        password: adminHashed,
        address: process.env.SEED_ADMIN_ADDRESS || 'Head Office, Platform Admin Address, Suite 100',
        role: 'admin',
      });
      console.log(`[Admin] Created: ${admin.email}`);
    } else {
      console.log(`[Admin] Exists: ${admin.email}`);
    }

    // 2. Seed Store Owners & Stores
    const defaultOwnerPassword = await bcrypt.hash('Owner@1234', 10);
    const storeOwnersData = [
      {
        user: {
          name: 'Jonathan Edward Miller',
          email: 'owner.cafe@storerating.com',
          password: defaultOwnerPassword,
          address: '742 Evergreen Terrace, Sector 4, Springfield',
          role: 'owner',
        },
        store: {
          name: 'The Roasted Bean Artisan Cafe',
          email: 'contact@roastedbeancafe.com',
          address: '104 Market Street, Downtown Arts District',
        },
      },
      {
        user: {
          name: 'Eleanor Beatrice Hughes',
          email: 'owner.books@storerating.com',
          password: defaultOwnerPassword,
          address: '12 Heritage Way, Old Town Quarter',
          role: 'owner',
        },
        store: {
          name: 'Chapter & Verse Rare Books',
          email: 'hello@chapterandversebooks.com',
          address: '45 Library Lane, Cultural Square',
        },
      },
      {
        user: {
          name: 'Vikramaditya Raj Malhotra',
          email: 'owner.tech@storerating.com',
          password: defaultOwnerPassword,
          address: '88 Cyber Park Boulevard, Silicon Corridor',
          role: 'owner',
        },
        store: {
          name: 'Apex Circuit Audio & Tech',
          email: 'support@apexcircuit.io',
          address: '500 Innovation Parkway, Suite B',
        },
      },
      {
        user: {
          name: 'Guillaume Henri Mercier',
          email: 'owner.bakery@storerating.com',
          password: defaultOwnerPassword,
          address: '33 Rue de Patisserie, West End Promenade',
          role: 'owner',
        },
        store: {
          name: 'Golden Crumb French Patisserie',
          email: 'bonjour@goldencrumb.com',
          address: '22 Riverfront Walk, North Quay',
        },
      },
      {
        user: {
          name: 'Marcus Alexander Thorne',
          email: 'owner.gym@storerating.com',
          password: defaultOwnerPassword,
          address: '19 Iron Works Drive, Metro Heights',
          role: 'owner',
        },
        store: {
          name: 'Ironclad Athletic Performance',
          email: 'fit@ironcladperformance.com',
          address: '800 Olympic Way, Sports Complex Arena',
        },
      },
      {
        user: {
          name: 'Seraphina Marie Laurent',
          email: 'owner.salon@storerating.com',
          password: defaultOwnerPassword,
          address: '61 Botanical Gardens Road, Floral Hill',
          role: 'owner',
        },
        store: {
          name: 'Luxe Botanical Hair Studio',
          email: 'care@luxebotanical.com',
          address: '710 Fashion Avenue, 2nd Floor',
        },
      },
    ];

    const storeMap = new Map(); // storeKey -> Store instance

    for (const item of storeOwnersData) {
      let owner = await User.findOne({ where: { email: item.user.email } });
      if (!owner) {
        owner = await User.create(item.user);
        console.log(`[Store Owner] Created: ${owner.email}`);
      } else {
        console.log(`[Store Owner] Exists: ${owner.email}`);
      }

      let store = await Store.findOne({ where: { email: item.store.email } });
      if (!store) {
        store = await Store.create({
          ...item.store,
          ownerId: owner.id,
        });
        console.log(`[Store] Created: "${store.name}" (Owner: ${owner.email})`);
      } else {
        if (!store.ownerId) {
          store.ownerId = owner.id;
          await store.save();
        }
        console.log(`[Store] Exists: "${store.name}"`);
      }
      storeMap.set(item.store.name, store);
    }

    // 3. Seed Normal Users
    const defaultUserPassword = await bcrypt.hash('User@1234', 10);
    const normalUsersData = [
      { name: 'Alexander Thomas Wright', email: 'alex.wright@demo.com', address: '12 Elm Street, Oak Ridge, Apartment 4B' },
      { name: 'Samantha Claire Jenkins', email: 'sam.jenkins@demo.com', address: '88 Meadowbrook Road, Sunset Valley' },
      { name: 'Benjamin Lucas Bennett', email: 'ben.bennett@demo.com', address: '310 Pine View Terrace, Lakeside Green' },
      { name: 'Ananya Deepika Sundaram', email: 'ananya.sundaram@demo.com', address: '405 Lotus Enclave, Green Meadows' },
      { name: 'Christopher Ryan Hayes', email: 'chris.hayes@demo.com', address: '77 Magnolia Avenue, Riverbend South' },
      { name: 'Victoria Elizabeth Ross', email: 'victoria.ross@demo.com', address: '150 Kingsway Road, Westminster Hill' },
      { name: 'Daniel Joseph Fernandez', email: 'daniel.f@demo.com', address: '228 Highland Crossing, Cedar Grove' },
      { name: 'Gabriella Sophia Martinez', email: 'gabriella.m@demo.com', address: '93 Sycamore Boulevard, Sunnyside' },
      { name: 'Michael Brandon Campbell', email: 'michael.c@demo.com', address: '614 Willow Creek Road, Westford' },
      { name: 'Hannah Christine Brooks', email: 'hannah.b@demo.com', address: '49 Chestnut Way, Millfield Crossing' },
      { name: 'Nicholas Andrew Cooper', email: 'nicholas.c@demo.com', address: '181 Aspen Ridge Drive, Blue Valley' },
      { name: 'Rachel Kimberly Foster', email: 'rachel.f@demo.com', address: '72 Maple Wood Lane, Harbor Point' },
      { name: 'Zachary Douglas Morgan', email: 'zachary.m@demo.com', address: '503 Birch Street, Summit Ridge Flat 2A' },
      { name: 'Olivia Margaret Edwards', email: 'olivia.e@demo.com', address: '360 Heather Dell, Spring Valley Heights' },
    ];

    const userMap = new Map(); // email -> User instance

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
        console.log(`[Normal User] Exists: ${user.email}`);
      }
      userMap.set(u.email, user);
    }

    // 4. Seed Ratings with varied distribution
    const cafe = storeMap.get('The Roasted Bean Artisan Cafe');
    const bookstore = storeMap.get('Chapter & Verse Rare Books');
    const tech = storeMap.get('Apex Circuit Audio & Tech');
    const bakery = storeMap.get('Golden Crumb French Patisserie');
    const salon = storeMap.get('Luxe Botanical Hair Studio');

    const ratingsPlan = [
      // Cafe (High ratings, 5 reviews)
      { userEmail: 'alex.wright@demo.com', storeId: cafe.id, rating: 5 },
      { userEmail: 'sam.jenkins@demo.com', storeId: cafe.id, rating: 5 },
      { userEmail: 'ben.bennett@demo.com', storeId: cafe.id, rating: 4 },
      { userEmail: 'ananya.sundaram@demo.com', storeId: cafe.id, rating: 5 },
      { userEmail: 'chris.hayes@demo.com', storeId: cafe.id, rating: 4 },

      // Bookstore (Solid 4-star, 4 reviews)
      { userEmail: 'victoria.ross@demo.com', storeId: bookstore.id, rating: 4 },
      { userEmail: 'daniel.f@demo.com', storeId: bookstore.id, rating: 5 },
      { userEmail: 'gabriella.m@demo.com', storeId: bookstore.id, rating: 4 },
      { userEmail: 'michael.c@demo.com', storeId: bookstore.id, rating: 3 },

      // Tech shop (Mixed ratings, 4 reviews)
      { userEmail: 'alex.wright@demo.com', storeId: tech.id, rating: 3 },
      { userEmail: 'hannah.b@demo.com', storeId: tech.id, rating: 2 },
      { userEmail: 'nicholas.c@demo.com', storeId: tech.id, rating: 4 },
      { userEmail: 'rachel.f@demo.com', storeId: tech.id, rating: 3 },

      // Bakery (Top tier, 5 reviews)
      { userEmail: 'sam.jenkins@demo.com', storeId: bakery.id, rating: 5 },
      { userEmail: 'ananya.sundaram@demo.com', storeId: bakery.id, rating: 5 },
      { userEmail: 'zachary.m@demo.com', storeId: bakery.id, rating: 5 },
      { userEmail: 'olivia.e@demo.com', storeId: bakery.id, rating: 4 },
      { userEmail: 'victoria.ross@demo.com', storeId: bakery.id, rating: 5 },

      // Salon (only 1 review)
      { userEmail: 'gabriella.m@demo.com', storeId: salon.id, rating: 4 },

      // Ironclad Athletic Performance has 0 ratings (testing empty state)
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

    console.log(`[Ratings] Created ${ratingsCreated} new ratings.`);
    console.log('Demo data seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding demo data failed:', err);
    process.exit(1);
  }
}

seedDemo();
