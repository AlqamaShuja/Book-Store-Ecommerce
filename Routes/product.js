const express = require("express");

const router = express.Router();

//import internal
const { create, productById, read, remove, updateProduct, list, listRelated, listBySearch, photo, listSearch } = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require("../controllers/user");


router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
//delete prod by Id
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct);

//sold /products?sortBy=sold&order=desc&limit=3
//arrival /products?sortBy=createdAt&order=asc&limit=4
router.get('/products', list);
router.get('/products/search', listSearch);

//list of related product
router.get('/products/related/:productId', listRelated);
router.post('/products/by/search', listBySearch);
//get photo
router.get('/product/photo/:productId', photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;