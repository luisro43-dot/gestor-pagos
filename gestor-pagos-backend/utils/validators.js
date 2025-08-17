// /utils/validators.js
import { body, validationResult } from 'express-validator';

// Reglas de validación para el registro de un nuevo usuario
export const registerValidationRules = () => {
  return [
    // El email debe ser un correo electrónico válido.
    body('email')
      .isEmail()
      .withMessage('Por favor, introduce un correo electrónico válido.')
      .normalizeEmail(), // Sanitiza el email (ej. convierte a minúsculas).

    // La contraseña debe tener al menos 6 caracteres.
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres.'),
  ];
};

// --- NUEVAS REGLAS ---
// Reglas de validación para el inicio de sesión
export const loginValidationRules = () => {
  return [
    // El email no puede estar vacío y debe ser un email.
    body('email')
      .notEmpty().withMessage('El correo electrónico es obligatorio.')
      .isEmail().withMessage('Por favor, introduce un correo electrónico válido.'),

    // La contraseña no puede estar vacía.
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria.'),
  ];
};


// Middleware para manejar los errores de validación
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Si no hay errores, continuamos con el controlador.
  }

  // Si hay errores, los extraemos y los enviamos como respuesta.
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
