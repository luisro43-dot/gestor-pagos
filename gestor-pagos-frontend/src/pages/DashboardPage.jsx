// /src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getServices, createService } from '../api/serviceApi';
import { getPayments, createPayment } from '../api/paymentApi';

import AddServiceForm from '../components/AddServiceForm';
import ServiceList from '../components/ServiceList';
import AddPaymentForm from '../components/AddPaymentForm';
import PaymentList from '../components/PaymentList';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const servicesResponse = await getServices();
        setServices(servicesResponse.data);

        const paymentsResponse = await getPayments();
        setPayments(paymentsResponse.data);
      } catch (err) {
        setError('No se pudieron cargar los datos. Intenta recargar la página.');
        console.error('Error al cargar datos iniciales:', err); // CORRECCIÓN
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddService = async (serviceData) => {
    setIsLoading(true);
    try {
      const response = await createService(serviceData);
      setServices([response.data, ...services]);
    } catch (err) {
      setError('No se pudo añadir el servicio.');
      console.error('Error al añadir servicio:', err); // CORRECCIÓN
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPayment = async (paymentData) => {
    setIsLoading(true);
    try {
      // Busca si el servicio ya existe
      let service = services.find(s => s.nombre_servicio.toLowerCase() === paymentData.nombre_servicio.toLowerCase());
      let serviceId;

      // Si no existe, créalo
      if (!service) {
        const newServiceResponse = await createService({ nombre_servicio: paymentData.nombre_servicio });
        serviceId = newServiceResponse.data.id;
        // Opcional: Actualizar el estado de servicios para que el nuevo aparezca en la lista
        setServices([newServiceResponse.data, ...services]);
      } else {
        serviceId = service.id;
      }

      // Prepara los datos del pago con el ID del servicio correcto
      const newPaymentData = {
        ...paymentData,
        servicio_id: serviceId,
      };
      delete newPaymentData.nombre_servicio; // No es parte del modelo de pago

      await createPayment(newPaymentData);

      // Recarga los pagos para mostrar el nuevo
      const paymentsResponse = await getPayments();
      setPayments(paymentsResponse.data);

    } catch (err) {
      setError('No se pudo registrar el pago.');
      console.error('Error al registrar pago:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Dashboard Principal</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <hr />
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <AddPaymentForm services={services} onAddPayment={handleAddPayment} isLoading={isLoading} />
        <hr />
        <PaymentList payments={payments} />
      </div>

      <hr style={{ margin: '40px 0' }} />

      <div>
        <AddServiceForm onAddService={handleAddService} isLoading={isLoading} />
        <hr />
        <ServiceList services={services} />
      </div>
    </div>
  );
};

export default DashboardPage;
