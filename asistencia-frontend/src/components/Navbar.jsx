import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { getRoleDisplayName, getRoleIcon } from '../utils/roleUtils';
import './Navbar.css';
import logoSvg from '../assets/AsisCarLogo.svg';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/cliente/home" className="navbar-brand">
          <img src={logoSvg} alt="AsisCar Logo" className="navbar-logo" />
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <div className="navbar-links">
                <Link 
                  to="/cliente/home" 
                  className={`navbar-link ${isCurrentPath('/cliente/home') ? 'active' : ''}`}
                >
                  🏠 Inicio
                </Link>
                <Link 
                  to="/servicios" 
                  className={`navbar-link ${isCurrentPath('/servicios') ? 'active' : ''}`}
                >
                  🛠️ Servicios
                </Link>
                {user?.userType === 'cliente' && (
                  <Link 
                    to="/cliente/solicitar" 
                    className={`navbar-link ${isCurrentPath('/cliente/solicitar') ? 'active' : ''}`}
                  >
                    📝 Solicitar
                  </Link>
                )}
                {user?.userType === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`navbar-link ${isCurrentPath('/admin') ? 'active' : ''}`}
                  >
                    ⚙️ Panel Admin
                  </Link>
                )}
              </div>

              <div className="navbar-user">
                <div className="user-info">
                  <span className="user-email">{user?.username}</span>
                  <span className="user-role">
                    {getRoleIcon(user?.userType)} {getRoleDisplayName(user?.userType)}
                  </span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Salir
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link 
                to="/login" 
                className={`navbar-link ${isCurrentPath('/login') ? 'active' : ''}`}
              >
                🔐 Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className={`navbar-link register ${isCurrentPath('/register') ? 'active' : ''}`}
              >
                📝 Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 