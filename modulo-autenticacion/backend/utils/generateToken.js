// /utils/generateToken.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Genera un JSON Web Token (JWT) para un usuario.
 * @param {string} userId - El ID del usuario para incluir en el payload del token.
 * @returns {string} - El token JWT firmado.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;
