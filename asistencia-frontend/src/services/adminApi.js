import API from './api';

// Obtener lista de administradores
export const obtenerAdministradores = async () => {
  try {
    const response = await API.get('/api/admins');
    return response.data;
  } catch (error) {
    console.error('Error al obtener administradores:', error);
    throw error;
  }
};

// Registrar nuevo administrador
export const registrarAdministrador = async (adminData) => {
  try {
    const response = await API.post('/api/register-admin', adminData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar administrador:', error);
    throw error;
  }
};

export const adminApi = {
  obtenerAdministradores,
  registrarAdministrador
}; 