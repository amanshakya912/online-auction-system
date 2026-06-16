const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const emailVerificationController = require('../controllers/emailVerificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');
const { validateSignUp, validateSignIn } = require('../middlewares/validationMiddleware');

// Public routes
router.post('/signin', validateSignIn, userController.signIn)
router.post('/signup', validateSignUp, userController.signUp)
router.get('/users', authMiddleware, adminMiddleware, userController.getAllUsers);
router.get('/user', optionalAuthMiddleware, userController.getUser);
router.get('/verify-email', emailVerificationController.verifyEmail);
router.post('/resend-verification', optionalAuthMiddleware, emailVerificationController.resendVerification);

// Protected routes (require authentication)
router.put('/user/edit', authMiddleware, userController.editUser);
router.delete('/user/delete', authMiddleware, userController.deleteUser)

module.exports = router;
