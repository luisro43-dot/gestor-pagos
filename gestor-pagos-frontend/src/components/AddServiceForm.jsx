// /src/components/AddServiceForm.jsx
import React, { useState } from 'react';

const AddServiceForm = ({ onAddService, isLoading }) => {
  const [nombre_servicio, setNombreServicio] = useState('');
  const [tipo_servicio, setTipoServicio] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre_servicio) {
      alert('El nombre del servicio es obligatorio.');
      return;
    }
    onAddService({ nombre_servicio, tipo_servicio });
    // Limpiamos el formulario después de enviar
    setNombreServicio('');
    setTipoServicio('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Añadir Nuevo Servicio</h3>
      <div>
        <label htmlFor="nombre_servicio">Nombre del Servicio:</label>
        <input
          type="text"
          id="nombre_servicio"
          value={nombre_servicio}
          onChange={(e) => setNombreServicio(e.target.value)}
          placeholder="Ej: Edesur, Netflix, Expensas"
        />
      </div>
      <div>
        <label htmlFor="tipo_servicio">Tipo (Opcional):</label>
        <input
          type="text"
          id="tipo_servicio"
          value={tipo_servicio}
          onChange={(e) => setTipoServicio(e.target.value)}
          placeholder="Ej: Luz, Streaming, Consorcio"
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Guardando...' : 'Añadir Servicio'}
      </button>
    </form>
  );
};

export default AddServiceForm;
