// /models/serviceModel.js
import pool from '../config/db.js';

const serviceModel = {
  /**
   * Crea un nuevo servicio para un usuario específico.
   * @param {object} serviceData - Contiene nombre_servicio, tipo_servicio y usuario_id.
   * @returns {Promise<number>} - El ID del nuevo servicio creado.
   */
  async create(serviceData) {
    const { nombre_servicio, tipo_servicio, usuario_id } = serviceData;
    const [result] = await pool.query(
      'INSERT INTO servicios (nombre_servicio, tipo_servicio, usuario_id) VALUES (?, ?, ?)',
      [nombre_servicio, tipo_servicio, usuario_id]
    );
    return result.insertId;
  },

  /**
   * Busca todos los servicios de un usuario específico.
   * @param {number} usuario_id - El ID del usuario.
   * @returns {Promise<Array>} - Un array con los servicios del usuario.
   */
  async findByUserId(usuario_id) {
    const [rows] = await pool.query('SELECT * FROM servicios WHERE usuario_id = ? ORDER BY fecha_creacion DESC', [usuario_id]);
    return rows;
  }
};

export default serviceModel;
