# Módulo de Autenticación Reutilizable (Node.js, Express, JWT, MySQL)

Este módulo proporciona un sistema de autenticación completo y listo para usar para aplicaciones web construidas con Node.js y Express.

## Características

-   Registro de nuevos usuarios.
-   Verificación de cuenta por correo electrónico.
-   Inicio de sesión (Login) con generación de JSON Web Token (JWT).
-   Middleware para proteger rutas y verificar el token.
-   Validación y sanitización de datos de entrada.
-   Conexión a base de datos MySQL.

---

## Guía de Backend (Node.js/Express)

Sigue estos pasos para integrar este módulo en un nuevo proyecto.

### Paso 1: Copiar el Módulo

Copia esta carpeta (`modulo-autenticacion`) completa a la raíz de tu nuevo proyecto.

### Paso 2: Base de Datos

Este módulo requiere una tabla `usuarios` en tu base de datos MySQL. Ejecuta la siguiente sentencia SQL para crearla:

```sql
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente', -- (pendiente, verificado)
  token_verificacion VARCHAR(255),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Paso 3: Instalar Dependencias

Abre una terminal en la raíz de tu nuevo proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
npm install express jsonwebtoken bcryptjs mysql2 nodemailer express-validator dotenv cors
```

### Paso 4: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz de tu proyecto y añade las siguientes variables. Asegúrate de reemplazarlas con tus propios valores.

```env
# Configuración del Servidor
PORT=5000

# Configuración de la Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_de_mysql
DB_NAME=nombre_de_tu_base_de_datos

# Secretos para JWT
JWT_SECRET=este_es_un_secreto_muy_largo_y_dificil_de_adivinar
JWT_EXPIRES_IN=1d

# Configuración de Nodemailer (para verificación por email)
# Nota: Si usas Gmail, puede que necesites crear una "Contraseña de Aplicación"
# desde la configuración de seguridad de tu cuenta de Google.
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# URL del Frontend (para los enlaces de verificación)
FRONTEND_URL=http://localhost:5173
```

### Paso 5: Integrar en tu Servidor Express

En el archivo principal de tu servidor (normalmente `server.js` o `index.js`), importa y usa las rutas de autenticación del módulo de la siguiente manera:

```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Importa las rutas de autenticación desde el módulo
import authRoutes from './modulo-autenticacion/routes/authRoutes.js';

// Carga las variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'El servidor funciona correctamente' });
});

// --- Integración del Módulo de Autenticación ---
app.use('/api/auth', authRoutes);
// ---------------------------------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
```

---

## Guía de Frontend (React)

Este módulo también incluye componentes y páginas de React listas para usar.

### Paso 1: Copiar Archivos

Copia el contenido de la carpeta `modulo-autenticacion/frontend` a la carpeta `src` de tu proyecto de React.

-   Copia `modulo-autenticacion/frontend/api` a `src/api`
-   Copia `modulo-autenticacion/frontend/components` a `src/components`
-   Copia `modulo-autenticacion/frontend/pages` a `src/pages`

### Paso 2: Instalar Dependencias del Frontend

Asegúrate de que tu proyecto de React tenga las siguientes dependencias instaladas:

```bash
npm install react-router-dom axios
```

### Paso 3: Configurar Rutas en React

En tu archivo principal de rutas (normalmente `App.jsx` o similar), configura las rutas para que usen los componentes que acabas de copiar.

```jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importa las páginas y componentes del módulo
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProtectedRoute from './components/ProtectedRoute';

// Importa tu página principal de la aplicación (ej. Dashboard)
import DashboardPage from './pages/DashboardPage'; 

function App() {
  return (
    <div>
      <h1>Mi Nueva Aplicación</h1>
      <Routes>
        {/* Rutas Públicas de Autenticación */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Rutas Privadas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Aquí puedes añadir más rutas protegidas */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
```

Con estos pasos, tendrás un flujo de autenticación de frontend completamente funcional e integrado con tu backend.