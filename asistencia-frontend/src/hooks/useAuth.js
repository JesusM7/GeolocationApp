import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        // Token expirado
        logout();
        return;
      }

      // Token válido
      setUser({
        id: decoded.id || decoded.userId,
        email: decoded.email,
        userType: decoded.user_type || decoded.role,
        username: decoded.username,
        exp: decoded.exp
      });
      setIsAuthenticated(true);
      setLoading(false);

    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      logout();
    }
  };

  const login = (token, userData = null) => {
    try {
      localStorage.setItem('token', token);
      
      if (userData) {
        localStorage.setItem('user_type', userData.user_type);
      }

      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id || decoded.userId,
        email: decoded.email,
        userType: decoded.user_type || decoded.role,
        username: decoded.username,
        exp: decoded.exp
      });
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Error al procesar login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const hasRole = (requiredRole) => {
    return user?.userType === requiredRole;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.userType);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const isTokenExpired = () => {
    try {
      const token = getToken();
      if (!token) return true;

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    hasAnyRole,
    getToken,
    isTokenExpired,
    checkAuthStatus
  };
};

export default useAuth; 