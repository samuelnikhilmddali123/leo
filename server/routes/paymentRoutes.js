import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentKey,
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/key', getPaymentKey);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);

export default router;
