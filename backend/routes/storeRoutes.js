const express = require('express');
const router = express.Router();
const { listStoresForUser, submitRating, getStoreDetail } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('user'));

router.get('/', listStoresForUser);
router.get('/:storeId', getStoreDetail);
router.post('/:storeId/ratings', submitRating);
router.put('/:storeId/ratings', submitRating);

module.exports = router;
