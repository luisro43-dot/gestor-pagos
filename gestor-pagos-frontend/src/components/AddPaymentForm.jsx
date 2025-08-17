// /src/components/AddPaymentForm.jsx
import React, { useState } from 'react';

const AddPaymentForm = ({ services, onAddPayment, isLoading }) => {
  const [formData, setFormData] = useState({
    servicio_id: '',
    fecha_pago: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    importe: '',
    metodo_pago: '',
  });

  const { servicio_id, fecha_pago, importe, metodo_pago } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!servicio_id || !fecha_pago || !importe) {
      alert('Debes seleccionar un servicio e ingresar la fecha y el importe.');
      return;
    }
    onAddPayment(formData);
    // Limpiamos el formulario, excepto la fecha
    setFormData({
      ...formData,
      servicio_id: '',
      importe: '',
      metodo_pago: '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar Nuevo Pago</h3>
      <div>
        <label htmlFor="servicio_id">Servicio:</label>
        <select id="servicio_id" name="servicio_id" value={servicio_id} onChange={handleChange} required>
          <option value="">-- Selecciona un servicio --</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.nombre_servicio}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fecha_pago">Fecha de Pago:</label>
        <input type="date" id="fecha_pago" name="fecha_pago" value={fecha_pago} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="importe">Importe:</label>
        <input type="number" id="importe" name="importe" value={importe} onChange={handleChange} placeholder="Ej: 1500.50" required />
      </div>
      <div>
        <label htmlFor="metodo_pago">Método de Pago (Opcional):</label>
        <input type="text" id="metodo_pago" name="metodo_pago" value={metodo_pago} onChange={handleChange} placeholder="Ej: Mercado Pago" />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Registrar Pago'}
      </button>
    </form>
  );
};

export default AddPaymentForm;
