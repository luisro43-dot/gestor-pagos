// /server.js
// Importamos los módulos necesarios
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './config/db.js'; // Importamos el archivo de conexión para que se ejecute

// Importamos nuestras rutas
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // <-- NUEVA RUTA

// Cargamos las variables de entorno desde el archivo .env
dotenv.config();

// Creamos una instancia de la aplicación Express
const app = express();

// Middlewares esenciales
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Permite al servidor entender y procesar JSON

// Ruta de prueba para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ message: '¡La API del gestor de pagos está funcionando!' });
});

// Usamos las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes); // <-- USAMOS LA NUEVA RUTA

// Definimos el puerto en el que correrá el servidor
const PORT = process.env.PORT || 5000;

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto http://localhost:${PORT}`);
});
