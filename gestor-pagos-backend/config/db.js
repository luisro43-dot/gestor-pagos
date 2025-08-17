import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargamos las variables de entorno
dotenv.config();

// Creamos el pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para verificar la conexión
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos establecida con éxito.');
    connection.release(); // Liberamos la conexión de vuelta al pool
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
}

// Verificamos la conexión al iniciar la aplicación
checkConnection();

// Exportamos el pool para poder usarlo en otras partes de la aplicación
export default pool;
