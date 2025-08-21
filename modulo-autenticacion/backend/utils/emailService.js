// /utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (userEmail, token) => {
  // Usamos una variable de entorno para la URL del frontend para más flexibilidad
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verificationLink = `${frontendUrl}/verify-email/${token}`;

  const mailOptions = {
    from: `"Gestor de Pagos" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Verifica tu cuenta en Gestor de Pagos',
    html: `
      <h1>¡Bienvenido a Gestor de Pagos!</h1>
      <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block;">Verificar mi cuenta</a>
      <p>Si no te registraste en nuestro sitio, por favor ignora este correo.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
