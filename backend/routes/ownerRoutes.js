const express = require('express');
const router = express.Router();
const { ownerDashboard } = require('../controllers/storeOwnerController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('owner'));

router.get('/dashboard', ownerDashboard);

module.exports = router;
