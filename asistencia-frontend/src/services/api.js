import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com' 
    : 'http://localhost:3000',
});

// Interceptor para agregar automáticamente el token JWT a todas las requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Verificar si el token no ha expirado
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expirado, remover del localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user_type');
          window.location.href = '/login';
          return Promise.reject(new Error('Token expirado'));
        }
        
        // Agregar token a headers
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // Token inválido, remover del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user_type');
        console.error('Token inválido:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado según el backend
      localStorage.removeItem('token');
      localStorage.removeItem('user_type');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default API;