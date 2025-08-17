// /src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { register } from '../api/authApi';

const RegisterPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await register(userData);
      setMessage(response.data.message);
      // Redirigimos al usuario a la página de login 3 segundos después de un registro exitoso.
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al registrar. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <RegisterForm onRegister={handleRegister} isLoading={isLoading} />
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;
