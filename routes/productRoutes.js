const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleWare');

router.post('/add-product',  upload.array('images', 5), productController.addProduct)

router.get('/products', productController.getProducts)

router.get('/product/:slug', productController.getProductBySlug);

router.post('/product/placeBid', productController.placeBid); 


module.exports = router;