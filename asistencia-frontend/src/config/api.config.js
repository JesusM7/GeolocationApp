// API Configuration
const API_CONFIG = {
  // Base URL configuration
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  
  // Timeout configuration
  TIMEOUT: 10000,
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: '/api/login',
      REGISTER: '/api/register',
      LOGOUT: '/api/logout',
      REFRESH: '/api/refresh',
      VERIFY: '/api/verify'
    },
    
    // User endpoints
    USERS: {
      PROFILE: '/api/users/profile',
      UPDATE_PROFILE: '/api/users/profile',
      CHANGE_PASSWORD: '/api/users/change-password'
    },
    
    // Services endpoints
    SERVICES: {
      LIST: '/servicios',
      CREATE: '/servicios',
      GET_BY_ID: (id) => `/servicios/${id}`,
      UPDATE: (id) => `/servicios/${id}`,
      DELETE: (id) => `/servicios/${id}`,
      TOGGLE_AVAILABILITY: (id) => `/servicios/${id}/disponibilidad`,
      NEARBY: '/servicios/cercanos',
      BY_USER: '/servicios/mis-servicios'
    },
    
    // Solicitudes (Requests) endpoints
    SOLICITUDES: {
      LIST: '/solicitudes',
      CREATE: '/solicitudes',
      GET_BY_ID: (id) => `/solicitudes/${id}`,
      UPDATE: (id) => `/solicitudes/${id}`,
      DELETE: (id) => `/solicitudes/${id}`,
      BY_USER: '/solicitudes/mis-solicitudes'
    },
    
    // Proveedores (Providers) endpoints
    PROVEEDORES: {
      LIST: '/proveedores',
      CREATE: '/proveedores',
      GET_BY_ID: (id) => `/proveedores/${id}`,
      UPDATE: (id) => `/proveedores/${id}`,
      DELETE: (id) => `/proveedores/${id}`
    },
    
    // Upload endpoints
    UPLOADS: {
      SERVICE_IMAGE: '/uploads/servicio',
      PROFILE_IMAGE: '/uploads/perfil'
    }
  }
};

// Helper function to build full URL
export const buildUrl = (endpoint, params = {}) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Replace URL parameters if any
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Helper function to get endpoint
export const getEndpoint = (category, action, params = {}) => {
  const endpoint = API_CONFIG.ENDPOINTS[category]?.[action];
  
  if (typeof endpoint === 'function') {
    return endpoint(params);
  }
  
  return endpoint;
};

export const { BASE_URL, TIMEOUT, ENDPOINTS } = API_CONFIG;
export default API_CONFIG; 