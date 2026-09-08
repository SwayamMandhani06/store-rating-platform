const bcrypt = require('bcryptjs');
const { Op, fn, col } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  collectErrors,
} = require('../utils/validators');

const SORTABLE_USER_FIELDS = ['name', 'email', 'address', 'role', 'createdAt'];
const SORTABLE_STORE_FIELDS = ['name', 'email', 'address', 'createdAt', 'rating'];

function parseSort(field, allowed, fallback) {
  const sortField = allowed.includes(field) ? field : fallback;
  return sortField;
}

// GET /api/admin/dashboard
async function dashboard(req, res, next) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);
    return res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/users - create Normal User, Admin, or Store Owner
async function createUser(req, res, next) {
  try {
    const { name, email, password, address, role } = req.body;

    const allowedRoles = ['admin', 'user', 'owner'];
    const finalRole = allowedRoles.includes(role) ? role : 'user';

    const errors = collectErrors([
      ['name', validateName(name)],
      ['email', validateEmail(email)],
      ['password', validatePassword(password)],
      ['address', validateAddress(address)],
    ]);
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'A user with this email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: finalRole });

    return res.status(201).json({
      id: user.id, name: user.name, email: user.email, address: user.address, role: user.role,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users?name=&email=&address=&role=&sortBy=&order=
async function listUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy, order } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const sortField = parseSort(sortBy, SORTABLE_USER_FIELDS, 'name');
    const sortOrder = order && order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      order: [[sortField, sortOrder]],
    });

    return res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/:id - includes rating if the user is a Store Owner
async function getUserDetail(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      include: [{ model: Store, as: 'store' }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let payload = user.toJSON();

    if (user.role === 'owner' && user.store) {
      const avg = await Rating.findOne({
        where: { storeId: user.store.id },
        attributes: [[fn('AVG', col('rating')), 'avgRating'], [fn('COUNT', col('rating')), 'ratingCount']],
        raw: true,
      });
      payload.rating = avg && avg.avgRating ? Number(parseFloat(avg.avgRating).toFixed(2)) : null;
      payload.ratingCount = avg ? Number(avg.ratingCount) : 0;
    }

    return res.json(payload);
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/stores - create a store, optionally linking an existing Store Owner
async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;

    const errors = collectErrors([
      ['email', validateEmail(email)],
      ['address', validateAddress(address)],
    ]);
    if (!name || name.length > 60) errors.name = 'Store name is required (max 60 characters)';
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors });

    const existing = await Store.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'A store with this email already exists' });

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner || owner.role !== 'owner') {
        return res.status(400).json({ message: 'ownerId must reference a user with role "owner"' });
      }
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    return res.status(201).json(store);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/stores?name=&email=&address=&sortBy=&order=
async function listStores(req, res, next) {
  try {
    const { name, email, address, sortBy, order } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [[fn('AVG', col('ratings.rating')), 'rating']],
      },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      subQuery: false,
    });

    let result = stores.map((s) => {
      const json = s.toJSON();
      json.rating = json.rating ? Number(parseFloat(json.rating).toFixed(2)) : null;
      return json;
    });

    const sortField = parseSort(sortBy, SORTABLE_STORE_FIELDS, 'name');
    const dir = order && order.toLowerCase() === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      const av = a[sortField] ?? '';
      const bv = b[sortField] ?? '';
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/owners - helper for the "assign owner" dropdown when creating a store
async function listStoreOwners(req, res, next) {
  try {
    const owners = await User.findAll({
      where: { role: 'owner' },
      attributes: ['id', 'name', 'email'],
    });
    return res.json(owners);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  dashboard,
  createUser,
  listUsers,
  getUserDetail,
  createStore,
  listStores,
  listStoreOwners,
};
