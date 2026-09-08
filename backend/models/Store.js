const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: {
        args: [1, 60],
        msg: 'Store name must be at most 60 characters',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Must be a valid email address' },
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: {
        args: [0, 400],
        msg: 'Address must be at most 400 characters',
      },
    },
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'owner_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'stores',
});

module.exports = Store;
