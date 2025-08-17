// /routes/paymentRoutes.js
import express from 'express';
import { createPayment, getPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protegemos ambas rutas con el middleware 'protect'
router.route('/')
  .post(protect, createPayment)
  .get(protect, getPayments);

export default router;
