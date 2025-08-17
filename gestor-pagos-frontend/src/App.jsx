// /src/App.jsx
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

// Páginas Públicas
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

// Componente Guardián
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Privadas
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div>
      <nav>
        <Link to="/register" style={{ marginRight: '10px' }}>Registro</Link>
        <Link to="/login">Iniciar Sesión</Link>
      </nav>
      <hr />
      <h1>Gestor de Pagos de Servicios</h1>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Rutas Privadas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Aquí dentro irán todas las demás rutas que queramos proteger */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
