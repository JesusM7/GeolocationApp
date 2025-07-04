import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>🚗 Bienvenido a Asiscar</h1>
      <p>Conecta con proveedores de grúas, mecánicos y repuestos fácilmente.</p>

      <div className="button-group">
        <button onClick={() => navigate('/login')}>Iniciar sesión</button>
        <button onClick={() => navigate('/register')}>Registrarse</button>
      </div>
    </div>
  );
}

export default LandingPage;