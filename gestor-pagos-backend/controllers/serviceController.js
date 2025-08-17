// /controllers/serviceController.js
import serviceModel from '../models/serviceModel.js';

/**
 * @desc    Crea un nuevo servicio.
 * @route   POST /api/services
 * @access  Private
 */
export const createService = async (req, res) => {
  try {
    const { nombre_servicio, tipo_servicio } = req.body;

    if (!nombre_servicio) {
      return res.status(400).json({ message: 'El nombre del servicio es obligatorio.' });
    }

    const serviceData = {
      nombre_servicio,
      tipo_servicio: tipo_servicio || null, // tipo_servicio es opcional
      usuario_id: req.user.id, // Obtenemos el ID del usuario desde el middleware
    };

    const newServiceId = await serviceModel.create(serviceData);
    const newService = { id: newServiceId, ...serviceData };

    res.status(201).json(newService);
  } catch (error) {
    console.error('Error al crear el servicio:', error);
    res.status(500).json({ message: 'Error en el servidor al crear el servicio.' });
  }
};

/**
 * @desc    Obtiene todos los servicios del usuario logueado.
 * @route   GET /api/services
 * @access  Private
 */
export const getServices = async (req, res) => {
  try {
    const services = await serviceModel.findByUserId(req.user.id);
    res.status(200).json(services);
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    res.status(500).json({ message: 'Error en el servidor al obtener los servicios.' });
  }
};
