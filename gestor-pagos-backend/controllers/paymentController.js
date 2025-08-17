// /controllers/paymentController.js
import paymentModel from '../models/paymentModel.js';

/**
 * @desc    Crea un nuevo pago.
 * @route   POST /api/payments
 * @access  Private
 */
export const createPayment = async (req, res) => {
  try {
    const { servicio_id, fecha_pago, importe, metodo_pago, descuento_obtenido, notas } = req.body;

    // Validación básica
    if (!servicio_id || !fecha_pago || !importe) {
      return res.status(400).json({ message: 'Servicio, fecha e importe son obligatorios.' });
    }

    const paymentData = {
      usuario_id: req.user.id,
      servicio_id,
      fecha_pago,
      importe,
      metodo_pago: metodo_pago || null,
      descuento_obtenido: descuento_obtenido || 0,
      notas: notas || null,
    };

    const newPaymentId = await paymentModel.create(paymentData);
    const newPayment = { id: newPaymentId, ...paymentData };

    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error al crear el pago:', error);
    res.status(500).json({ message: 'Error en el servidor al crear el pago.' });
  }
};

/**
 * @desc    Obtiene todos los pagos del usuario logueado.
 * @route   GET /api/payments
 * @access  Private
 */
export const getPayments = async (req, res) => {
  try {
    const payments = await paymentModel.findByUserId(req.user.id);
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener los pagos.' });
  }
};
