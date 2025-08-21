// /controllers/authController.js
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/emailService.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, proporciona un email y una contraseña.' });
  }

  try {
    const userExists = await userModel.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = {
      email,
      password: hashedPassword,
      token_verificacion: verificationToken,
      estado: 'pendiente',
    };
    
    const userId = await userModel.create(newUser);
    
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ 
        message: 'Registro exitoso. Por favor, revisa tu correo para verificar tu cuenta.',
        userId: userId 
    });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el servidor al intentar registrar el usuario.' });
  }
};

// --- VERSIÓN RESTAURADA Y CORREGIDA ---
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(`[VERIFICACIÓN] Buscando usuario con token: ${token}`);

    const user = await userModel.findByVerificationToken(token);

    if (!user) {
      console.log(`[VERIFICACIÓN] FALLO: No se encontró usuario con el token.`);
      return res.status(400).json({ message: 'Token de verificación inválido o expirado.' });
    }

    console.log(`[VERIFICACIÓN] ÉXITO: Usuario encontrado con ID: ${user.id}`);
    await userModel.verifyUser(user.id);
    res.status(200).json({ message: '¡Cuenta verificada con éxito! Ya puedes iniciar sesión.' });

  } catch (error) {
    console.error('Error en la verificación de email:', error);
    res.status(500).json({ message: 'Error en el servidor al intentar verificar la cuenta.' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    if (user.estado !== 'verificado') {
      return res.status(403).json({ message: 'Por favor, verifica tu correo electrónico antes de iniciar sesión.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const token = generateToken(user.id);
    res.json({
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error en el servidor al intentar iniciar sesión.' });
  }
};
