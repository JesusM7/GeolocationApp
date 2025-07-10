import API from './api';
import { ENDPOINTS } from '../config/api.config.js';

// API para gestión de servicios (grúa y mecánico)
export const serviciosApi = {
  // Crear un nuevo servicio
  crearServicio: async (servicioData) => {
    try {
      const response = await API.post(ENDPOINTS.SERVICES.CREATE, servicioData);
      return response.data;
    } catch (error) {
      // Preservar el objeto error completo para mejor manejo en el frontend
      throw error;
    }
  },

  // Obtener todos los servicios
  obtenerServicios: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.ciudad) params.append('ciudad', filtros.ciudad);
      if (filtros.disponible !== undefined) params.append('disponible', filtros.disponible);
      
      const response = await API.get(`${ENDPOINTS.SERVICES.LIST}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener mis servicios (del usuario autenticado)
  obtenerMisServicios: async () => {
    try {
      const response = await API.get(ENDPOINTS.SERVICES.BY_USER);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar servicios cercanos
  buscarServiciosCercanos: async (latitud, longitud, tipo = null, radioMaximo = 30) => {
    try {
      const params = new URLSearchParams({
        latitud: latitud.toString(),
        longitud: longitud.toString(),
        radioMaximo: radioMaximo.toString()
      });
      
      if (tipo) params.append('tipo', tipo);
      
      const response = await API.get(`${ENDPOINTS.SERVICES.NEARBY}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener servicio por ID
  obtenerServicioPorId: async (id) => {
    try {
      const response = await API.get(ENDPOINTS.SERVICES.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar servicio
  actualizarServicio: async (id, servicioData) => {
    try {
      const response = await API.put(ENDPOINTS.SERVICES.UPDATE(id), servicioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar disponibilidad del servicio
  cambiarDisponibilidad: async (id, disponible) => {
    try {
      const response = await API.patch(ENDPOINTS.SERVICES.TOGGLE_AVAILABILITY(id), { disponible });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Subir imagen del servicio
  subirImagen: async (archivo) => {
    try {
      const formData = new FormData();
      formData.append('foto', archivo);
      
      const response = await API.post(ENDPOINTS.UPLOADS.SERVICE_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar servicio
  eliminarServicio: async (id) => {
    try {
      const response = await API.delete(ENDPOINTS.SERVICES.DELETE(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default serviciosApi; 