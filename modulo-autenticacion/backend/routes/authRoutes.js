// /routes/authRoutes.js
import express from 'express';
import { registerUser, verifyEmail, loginUser } from '../controllers/authController.js';
// Importamos la nueva regla de validación
import { registerValidationRules, loginValidationRules, validate } from '../utils/validators.js';

const router = express.Router();

// Ruta de registro con validación
router.post('/register', registerValidationRules(), validate, registerUser);

// Ruta de verificación
router.get('/verify-email/:token', verifyEmail);

// Ruta de login con validación
router.post('/login', loginValidationRules(), validate, loginUser);

export default router;
