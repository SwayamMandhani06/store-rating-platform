const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// A store belongs to one owner (User with role 'owner')
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasOne(Store, { as: 'store', foreignKey: 'ownerId' });

// Ratings link Users and Stores (many-to-many through Rating)
Rating.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Rating.belongsTo(Store, { as: 'store', foreignKey: 'storeId' });
User.hasMany(Rating, { as: 'ratings', foreignKey: 'userId' });
Store.hasMany(Rating, { as: 'ratings', foreignKey: 'storeId' });

module.exports = { sequelize, User, Store, Rating };
