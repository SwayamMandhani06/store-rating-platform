const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
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
        args: [20, 60],
        msg: 'Name must be between 20 and 60 characters',
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
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
  role: {
    type: DataTypes.ENUM('admin', 'user', 'owner'),
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  tableName: 'users',
});

module.exports = User;
