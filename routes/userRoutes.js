const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleWare');

router.post('/signin', userController.signIn)

router.post('/signup', userController.signUp)

router.get('/users', userController.getAllUsers);

router.get('/user', userController.getUser);

router.put('/user/edit', userController.editUser);

router.delete('/user/delete', userController.deleteUser)

module.exports = router;