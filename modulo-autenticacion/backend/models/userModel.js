// /models/userModel.js
import pool from '../config/db.js';

const userModel = {
  // --- NUEVA FUNCIÓN ---
  async findById(id) {
    const [rows] = await pool.query('SELECT id, email, estado FROM usuarios WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByVerificationToken(token) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE token_verificacion = ?', [token]);
    return rows[0] || null;
  },

  async create(newUser) {
    const { email, password, token_verificacion, estado } = newUser;
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password, token_verificacion, estado) VALUES (?, ?, ?, ?)',
      [email, password, token_verificacion, estado]
    );
    return result.insertId;
  },

  async verifyUser(userId) {
    const [result] = await pool.query(
      "UPDATE usuarios SET estado = 'verificado', token_verificacion = NULL WHERE id = ?",
      [userId]
    );
    return result.affectedRows > 0;
  },
};

export default userModel;
