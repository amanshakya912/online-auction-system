const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const protect = [authMiddleware, adminMiddleware];

// Dashboard
router.get('/admin/dashboard/metrics', ...protect, adminController.getDashboardMetrics);

// User management
router.get('/admin/users', ...protect, adminController.getUsers);
router.patch('/admin/users/:userId/suspend', ...protect, adminController.suspendUser);
router.patch('/admin/users/:userId/activate', ...protect, adminController.activateUser);
router.get('/admin/users/:userId/activity', ...protect, adminController.getUserActivity);
router.post('/admin/users/:userId/reset-password', ...protect, adminController.resetUserPassword);

// Auction monitoring
router.get('/admin/auctions', ...protect, adminController.getAdminAuctions);
router.get('/admin/auctions/:auctionId', ...protect, adminController.getAuctionDetails);
router.post('/admin/auctions/:auctionId/end', ...protect, adminController.endAuctionEarly);
router.post('/admin/auctions/:auctionId/flag', ...protect, adminController.flagSuspiciousActivity);

module.exports = router;
