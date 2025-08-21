// /config/db.js
// Este archivo configura y exporta el pool de conexiones a la base de datos MySQL.
// Es una plantilla que depende de las variables de entorno del proyecto que lo utilice.

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carga las variables de entorno del archivo .env del proyecto raíz.
dotenv.config();

// Asegúrate de que tu archivo .env contenga las siguientes variables:
// DB_HOST: La dirección de tu servidor de base de datos (ej: 'localhost')
// DB_USER: El usuario de la base de datos.
// DB_PASSWORD: La contraseña del usuario.
// DB_NAME: El nombre de la base de datos.

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para verificar la conexión al iniciar la aplicación.
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida con éxito.');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos. Asegúrate de que las variables de entorno (DB_HOST, DB_USER, etc.) son correctas.', error);
    // En un entorno de producción, podrías querer terminar el proceso si no hay DB
    // process.exit(1); 
  }
}

// Verificamos la conexión al iniciar la aplicación.
// En un nuevo proyecto, esta línea se ejecutará cuando importes el pool por primera vez.
checkConnection();

export default pool;
