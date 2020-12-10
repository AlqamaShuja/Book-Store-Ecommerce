const express = require('express');
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById, addOrderToUserHistory } = require('../controllers/user');
const { create, listOrder, getStatusValues, orderById, updateOrderStatus } = require('../controllers/order');
const { decreaseQuantity } = require('../controllers/product');


router.get('/order/list/:userId', requireSignin, isAuth, isAdmin, listOrder);
router.get('/order/status-values/:userId', requireSignin, isAuth, isAdmin, getStatusValues);
router.post('/order/create/:userId', requireSignin, isAuth, addOrderToUserHistory, decreaseQuantity, create); 

//update status route
router.put('/order/:orderId/status/:userId', requireSignin, isAuth, isAdmin, updateOrderStatus);

//order/update-status/:userId

router.param('userId', userById);
router.param('orderId', orderById);

module.exports = router;