// /src/api/serviceApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/services';

// Creamos una instancia de Axios para configurar los headers una sola vez.
const api = axios.create({
  baseURL: API_URL,
});

// Usamos un "interceptor" para añadir el token a cada petición saliente.
// Esto es mucho más eficiente que añadirlo manualmente en cada función.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


/**
 * Obtiene todos los servicios del usuario autenticado.
 * @returns {Promise}
 */
export const getServices = () => {
  return api.get('/');
};

/**
 * Crea un nuevo servicio para el usuario autenticado.
 * @param {object} serviceData - { nombre_servicio, tipo_servicio }
 * @returns {Promise}
 */
export const createService = (serviceData) => {
  return api.post('/', serviceData);
};
