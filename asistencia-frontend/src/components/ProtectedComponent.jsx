import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';    

const ProtectedComponent = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Decodificar y validar el token
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Verificar si el token ha expirado
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_type');
      return <Navigate to="/login" replace />;
    }

    // Verificar roles si se especificaron
    if (allowedRoles.length > 0) {
      const userRole = decoded.user_type || decoded.role;
      if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />;
      }
    }

    // Todo está bien, renderizar el componente protegido
    return children;
    
  } catch (error) {
    // Token malformado o inválido
    console.error('Error al decodificar token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedComponent;
