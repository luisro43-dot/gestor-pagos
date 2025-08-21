// /frontend/components/ProtectedRoute.jsx
// Este componente actúa como un guardián para las rutas privadas.
// Verifica si el usuario está autenticado (buscando un token en localStorage).
// Si no lo está, lo redirige a la página de login.
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Verificamos si existe un token en el localStorage.
  const token = localStorage.getItem('token');

  // Si no hay token, redirigimos al usuario a la página de login.
  // El prop 'replace' evita que el usuario pueda volver atrás en el historial del navegador.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay un token, permitimos que se renderice el componente hijo (la página protegida).
  // El componente <Outlet /> es un placeholder de react-router-dom para los componentes anidados.
  return <Outlet />;
};

export default ProtectedRoute;
