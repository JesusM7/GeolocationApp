import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthContext();

  // Si el usuario está autenticado, redirigir al home correspondiente
  if (isAuthenticated) {
    navigate('/cliente/home');
    return null;
  }

  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1>🚗LOGO</h1>
        <p className="hero-subtitle">
          Tu plataforma de confianza para servicios automotrices
        </p>
        <p className="hero-description">
          Conecta con proveedores de grúas, mecánicos y servicios especializados cerca de ti. 
          Rápido, confiable y disponible 24/7.
        </p>
      </div>

      <div className="features-section">
        <div className="feature">
          <div className="feature-icon">🚛</div>
          <h3>Servicio de Grúa</h3>
          <p>Asistencia en carretera las 24 horas</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔧</div>
          <h3>Mecánica a Domicilio</h3>
          <p>Reparaciones donde te encuentres</p>
        </div>
        <div className="feature">
          <div className="feature-icon">📍</div>
          <h3>Geolocalización</h3>
          <p>Encuentra servicios cerca de ti</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>¿Listo para comenzar?</h2>
        <div className="button-group">
          <button 
            className="btn-primary"
            onClick={() => navigate('/login')}
          >
            🔐 Iniciar Sesión
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/register')}
          >
            📝 Registrarse
          </button>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h4>Para Usuarios</h4>
          <p>Solicita servicios de grúa y mecánica de forma rápida y segura</p>
        </div>
        <div className="info-card">
          <h4>Para Proveedores</h4>
          <p>Registra tu servicio y amplía tu alcance de clientes</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;