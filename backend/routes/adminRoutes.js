const express = require('express');
const router = express.Router();
const {
  dashboard,
  createUser,
  listUsers,
  getUserDetail,
  createStore,
  listStores,
  listStoreOwners,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', dashboard);

router.post('/users', createUser);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);

router.post('/stores', createStore);
router.get('/stores', listStores);
router.get('/owners', listStoreOwners);

module.exports = router;
