import { useNavigate } from 'react-router-dom';
import './HomeCliente.css'; // Opcional si quieres usar CSS separado
import {jwtDecode} from 'jwt-decode';
import { useEffect, useState } from 'react';


function HomeCliente() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const formateado = capitalizar(decoded.username);
      setUsername(formateado);

    }
  }, []);

  function capitalizar(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}


   const handleLogout = () => {
    localStorage.clear(); // o elimina solo lo necesario
    alert('Sesión cerrada 🔒');
    navigate('/login');
  };

  return (
    <div className="cliente-home">
      <h1>Bienvenido, {username} 👋</h1>
      <p>¿Qué deseas hacer hoy?</p>

      <div className="acciones">
        <button onClick={() => navigate('/cliente/solicitar')}>
          📌 Solicitar un servicio
        </button>

        <button onClick={() => navigate('/cliente/mis-solicitudes')}>
          📄 Ver mis solicitudes
        </button>

         <button onClick={handleLogout}>Cerrar sesión</button>

      </div>
    </div>
  );
}

export default HomeCliente;