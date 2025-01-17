const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleWare');

router.post('/signin', userController.signIn)

router.post('/signup', userController.signUp)

router.get('/users', userController.getAllUsers);

router.get('/user', userController.getUser);


module.exports = router;