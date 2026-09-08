require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const email = process.env.SEED_ADMIN_EMAIL;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log(`Admin account already exists for ${email}. Skipping.`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10);
    await User.create({
      name: process.env.SEED_ADMIN_NAME,
      email,
      password: hashed,
      address: process.env.SEED_ADMIN_ADDRESS,
      role: 'admin',
    });

    console.log(`Seeded System Administrator account: ${email} / ${process.env.SEED_ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
