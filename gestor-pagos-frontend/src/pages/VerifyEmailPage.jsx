// /src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';

const VerifyEmailPage = () => {
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const [error, setError] = useState(false);
  const { token } = useParams();

  useEffect(() => {
    const processVerification = async () => {
      if (!token) {
        setMessage('No se proporcionó un token de verificación.');
        setError(true);
        return;
      }

      try {
        // Ahora esperamos una respuesta con un campo 'message'
        const response = await verifyEmail(token);
        setMessage(response.data.message);
        setError(false);
      } catch (err) {
        console.error('Detalle del error de verificación:', err);
        setMessage(err.response?.data?.message || 'Error al verificar la cuenta. El enlace puede ser inválido o haber expirado.');
        setError(true);
      }
    };

    processVerification();
  }, [token]);

  return (
    <div>
      <h2>Verificación de Cuenta</h2>
      <p style={{ color: error ? 'red' : 'green' }}>{message}</p> {/* Damos un poco de estilo al mensaje */}
      {!error ? (
        <Link to="/login">Ir a Iniciar Sesión</Link>
      ) : (
        <Link to="/register">Volver a Registrarse</Link>
      )}
    </div>
  );
};

export default VerifyEmailPage;
