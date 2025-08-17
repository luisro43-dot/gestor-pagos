// /src/components/ServiceList.jsx
import React from 'react';

const ServiceList = ({ services }) => {
  if (services.length === 0) {
    return <p>Aún no has añadido ningún servicio. ¡Empieza ahora!</p>;
  }

  return (
    <div>
      <h3>Mis Servicios</h3>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <strong>{service.nombre_servicio}</strong>
            {service.tipo_servicio && ` - (${service.tipo_servicio})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
