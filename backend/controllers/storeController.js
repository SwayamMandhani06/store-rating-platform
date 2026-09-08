const { Op, fn, col } = require('sequelize');
const { Store, Rating, sequelize } = require('../models');
const { validateRating } = require('../utils/validators');

// GET /api/stores?name=&address=&sortBy=&order= - Normal User store listing with search
async function listStoresForUser(req, res, next) {
  try {
    const { name, address, sortBy, order } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [[fn('AVG', col('ratings.rating')), 'overallRating']],
      },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      subQuery: false,
    });

    // Fetch this user's own submitted ratings for these stores in one query
    const storeIds = stores.map((s) => s.id);
    const myRatings = await Rating.findAll({
      where: { userId: req.user.id, storeId: { [Op.in]: storeIds } },
    });
    const myRatingMap = new Map(myRatings.map((r) => [r.storeId, r.rating]));

    let result = stores.map((s) => {
      const json = s.toJSON();
      json.overallRating = json.overallRating ? Number(parseFloat(json.overallRating).toFixed(2)) : null;
      json.userRating = myRatingMap.get(s.id) || null;
      return json;
    });

    const allowedSort = ['name', 'address', 'overallRating'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'name';
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

// POST /api/stores/:storeId/ratings - submit a new rating (or reject if one exists)
// PUT  /api/stores/:storeId/ratings - modify an existing rating
async function submitRating(req, res, next) {
  try {
    const storeId = req.params.storeId;
    const { rating } = req.body;

    const ratingError = validateRating(rating);
    if (ratingError) return res.status(400).json({ message: 'Validation failed', errors: { rating: ratingError } });

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const [record, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { rating },
    });

    if (!created) {
      record.rating = rating;
      await record.save();
    }

    return res.status(created ? 201 : 200).json(record);
  } catch (err) {
    next(err);
  }
}

// GET /api/stores/:storeId - store details with rating distribution
async function getStoreDetail(req, res, next) {
  try {
    const storeId = req.params.storeId;
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const ratings = await Rating.findAll({
      where: { storeId },
      attributes: ['rating'],
    });

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let sum = 0;

    for (const r of ratings) {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
        total++;
        sum += r.rating;
      }
    }

    const myRating = await Rating.findOne({
      where: { userId: req.user.id, storeId },
    });

    const overallRating = total > 0 ? Number((sum / total).toFixed(2)) : null;

    return res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      overallRating,
      totalRatings: total,
      distribution,
      userRating: myRating ? myRating.rating : null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listStoresForUser, submitRating, getStoreDetail };
