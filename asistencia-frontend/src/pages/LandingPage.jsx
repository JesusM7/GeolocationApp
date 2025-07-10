import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './LandingPage.css';
import logoSvg from '../assets/AsisCarLogo.svg';

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
        <div className="logo-container">
          <img src={logoSvg} alt="AsisCar Logo" className="logo-svg" />
        </div>
        
        <p className="hero-subtitle">
          Tu plataforma de confianza para servicios automotrices
        </p>
        <p className="hero-description">
          Conecta con proveedores de grúas, mecánicos y servicios especializados cerca de ti. 
        </p>
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