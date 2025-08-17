// /models/paymentModel.js
import pool from '../config/db.js';

const paymentModel = {
  /**
   * Crea un nuevo pago para un usuario y servicio específico.
   * @param {object} paymentData - Datos del pago.
   * @returns {Promise<number>} - El ID del nuevo pago creado.
   */
  async create(paymentData) {
    const {
      usuario_id,
      servicio_id,
      fecha_pago,
      importe,
      metodo_pago,
      descuento_obtenido,
      notas,
    } = paymentData;

    const [result] = await pool.query(
      'INSERT INTO pagos (usuario_id, servicio_id, fecha_pago, importe, metodo_pago, descuento_obtenido, notas) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuario_id, servicio_id, fecha_pago, importe, metodo_pago, descuento_obtenido, notas]
    );
    return result.insertId;
  },

  /**
   * Busca todos los pagos de un usuario específico.
   * @param {number} usuario_id - El ID del usuario.
   * @returns {Promise<Array>} - Un array con los pagos del usuario.
   */
  async findByUserId(usuario_id) {
    // Unimos las tablas para obtener también el nombre del servicio en la misma consulta.
    const query = `
      SELECT 
        p.id, 
        p.fecha_pago, 
        p.importe, 
        p.metodo_pago,
        s.nombre_servicio 
      FROM pagos p
      JOIN servicios s ON p.servicio_id = s.id
      WHERE p.usuario_id = ? 
      ORDER BY p.fecha_pago DESC
    `;
    const [rows] = await pool.query(query, [usuario_id]);
    return rows;
  }
};

export default paymentModel;
