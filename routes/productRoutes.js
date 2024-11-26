const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/add-product', productController.addProduct)

router.get('/products', productController.getProducts)

router.get('/product/:slug', productController.getProductBySlug);


module.exports = router;