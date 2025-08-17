// /routes/serviceRoutes.js
import express from 'express';
import { createService, getServices } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas aquí están protegidas.
// El middleware 'protect' se ejecutará antes que los controladores.
router.route('/')
  .post(protect, createService)
  .get(protect, getServices);

export default router;
