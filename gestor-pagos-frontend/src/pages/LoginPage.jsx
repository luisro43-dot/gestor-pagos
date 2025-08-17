// /src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { login } from '../api/authApi';

const LoginPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await login(credentials);
      // Guardamos el token en el almacenamiento local del navegador
      localStorage.setItem('token', response.data.token);
      
      setMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      // Redirigimos al usuario al dashboard principal (que crearemos a continuación)
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <LoginForm onLogin={handleLogin} isLoading={isLoading} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
