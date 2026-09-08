const express = require('express');
const router = express.Router();
const { listStoresForUser, submitRating } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('user'));

router.get('/', listStoresForUser);
router.post('/:storeId/ratings', submitRating);
router.put('/:storeId/ratings', submitRating);

module.exports = router;
