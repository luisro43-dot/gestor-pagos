// /middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  // Verificamos si el token viene en los headers y si empieza con "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extraemos el token del header (ej: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificamos la firma del token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Buscamos al usuario por el ID que viene en el token y lo adjuntamos a la petición
      // Esto nos permitirá saber qué usuario está haciendo la solicitud en las rutas protegidas.
      req.user = await userModel.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado.' });
      }

      next(); // Si todo está bien, continuamos a la siguiente función (el controlador)
    } catch (error) {
      console.error('Error de autenticación:', error);
      res.status(401).json({ message: 'No autorizado, token inválido.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se proporcionó un token.' });
  }
};

export { protect };
