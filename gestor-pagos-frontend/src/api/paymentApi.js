// /src/api/paymentApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payments';

const api = axios.create({
  baseURL: API_URL,
});

// Reutilizamos el interceptor para añadir el token a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Obtiene todos los pagos del usuario autenticado.
 * @returns {Promise}
 */
export const getPayments = () => {
  return api.get('/');
};

/**
 * Crea un nuevo pago para el usuario autenticado.
 * @param {object} paymentData - Datos del pago.
 * @returns {Promise}
 */
export const createPayment = (paymentData) => {
  return api.post('/', paymentData);
};
