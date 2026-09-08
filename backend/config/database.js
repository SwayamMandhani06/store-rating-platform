const { Sequelize } = require('sequelize');
require('dotenv').config();

const baseOptions = {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
  },
};

const connectionUri =
  process.env.DATABASE_URL ||
  (process.env.DB_HOST &&
  (process.env.DB_HOST.startsWith('postgres://') || process.env.DB_HOST.startsWith('postgresql://'))
    ? process.env.DB_HOST
    : null);

const sequelize = connectionUri
  ? new Sequelize(connectionUri, baseOptions)
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        ...baseOptions,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
      }
    );

module.exports = sequelize;
