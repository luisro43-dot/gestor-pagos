// /src/components/PaymentList.jsx
import React from 'react';

const PaymentList = ({ payments }) => {
  if (payments.length === 0) {
    return <p>Todavía no has registrado ningún pago.</p>;
  }

  // Función para formatear la fecha a un formato más legible (DD/MM/AAAA)
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };

  return (
    <div>
      <h3>Historial de Pagos</h3>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Servicio</th>
            <th>Importe</th>
            <th>Método de Pago</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{formatDate(payment.fecha_pago)}</td>
              <td>{payment.nombre_servicio}</td>
              <td>${payment.importe}</td>
              <td>{payment.metodo_pago || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
