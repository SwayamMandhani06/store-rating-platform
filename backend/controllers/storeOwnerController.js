const { fn, col } = require('sequelize');
const { Store, Rating, User } = require('../models');

// GET /api/owner/dashboard - the logged-in Store Owner's own store stats
async function ownerDashboard(req, res, next) {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });
    if (!store) return res.status(404).json({ message: 'No store is associated with this account yet' });

    const raters = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }],
      order: [['createdAt', 'DESC']],
    });

    const avgResult = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[fn('AVG', col('rating')), 'avgRating']],
      raw: true,
    });
    const averageRating = avgResult && avgResult.avgRating ? Number(parseFloat(avgResult.avgRating).toFixed(2)) : null;

    return res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating,
      totalRatings: raters.length,
      raters: raters.map((r) => ({
        ratingId: r.id,
        rating: r.rating,
        submittedAt: r.createdAt,
        user: r.user,
      })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { ownerDashboard };
