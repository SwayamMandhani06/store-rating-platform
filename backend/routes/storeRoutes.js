const express = require('express');
const router = express.Router();
const { listStoresForUser, submitRating, getStoreDetail } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');

// Store rating distribution breakdown is readable by any authenticated user
router.get('/:storeId', authenticate, getStoreDetail);

// Normal User actions
router.get('/', authenticate, authorize('user'), listStoresForUser);
router.post('/:storeId/ratings', authenticate, authorize('user'), submitRating);
router.put('/:storeId/ratings', authenticate, authorize('user'), submitRating);

module.exports = router;
