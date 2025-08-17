// /src/api/authApi.js
import axios from 'axios';

// Configuramos la URL base de nuestra API del backend
const API_URL = 'http://localhost:5000/api/auth';

/**
 * Llama al endpoint de registro del backend.
 * @param {object} userData - Contiene el email y la contraseña del usuario.
 * @returns {Promise} - La promesa de la respuesta de Axios.
 */
export const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

/**
 * Llama al endpoint de verificación de email del backend.
 * @param {string} token - El token de verificación desde la URL.
 * @returns {Promise} - La promesa de la respuesta de Axios.
 */
export const verifyEmail = (token) => {
  return axios.get(`${API_URL}/verify-email/${token}`);
};

/**
 * Llama al endpoint de login del backend.
 * @param {object} credentials - Contiene el email y la contraseña para el login.
 * @returns {Promise} - La promesa de la respuesta de Axios.
 */
export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};
