import express from 'express';
import {
  getDashboardStats,
  getAnalytics,
  getCustomers,
  updateCustomerRole,
} from '../controllers/adminController.js';
import {
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import {
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from '../controllers/reviewController.js';
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth + admin middleware to all routes below
router.use(protect, admin);

// Dashboard & Analytics
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// Customer Management
router.get('/customers', getCustomers);
router.put('/customers/:id/role', updateCustomerRole);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Coupon Management
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Review Moderation
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

// Banner Management
router.get('/banners', getAllBanners);
router.post('/banners', createBanner);
router.put('/banners/:id', updateBanner);
router.delete('/banners/:id', deleteBanner);

export default router;
