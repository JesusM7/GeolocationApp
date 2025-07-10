import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { serviciosApi } from '../services/serviciosApi';
import './HomeCliente.css';

function HomeCliente() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuthContext();
  const [estadisticas, setEstadisticas] = useState({
    totalServicios: 0,
    serviciosActivos: 0,
    ultimoServicio: null
  });
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(true);

  const handleLogout = () => {
    logout();
    alert('Sesión cerrada 🔒');
    navigate('/login');
  };

  const capitalizar = (texto) => {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  // Función para obtener estadísticas del usuario
  const obtenerEstadisticas = async () => {
    try {
      setLoadingEstadisticas(true);
      const servicios = await serviciosApi.obtenerMisServicios();
      
      const serviciosActivos = servicios.filter(s => 
        s.estado && ['pendiente', 'en_proceso', 'asignado'].includes(s.estado.toLowerCase())
      );

      const ultimoServicio = servicios.length > 0 
        ? servicios.sort((a, b) => new Date(b.fechaCreacion || b.createdAt) - new Date(a.fechaCreacion || a.createdAt))[0]
        : null;

      setEstadisticas({
        totalServicios: servicios.length,
        serviciosActivos: serviciosActivos.length,
        ultimoServicio
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      // En caso de error, mantener valores por defecto
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  useEffect(() => {
    if (user) {
      obtenerEstadisticas();
    }
  }, [user]);

  const accionesRapidas = [
    {
      titulo: 'Solicitar Servicio de Grúa',
      descripcion: 'Solicita asistencia en carretera',
      icono: '🚛',
      color: '#FF5722',
      accion: () => {
        navigate('/servicios', { state: { tabActiva: 'lista', filtroTipo: 'grua' } });
      }
    },
    {
      titulo: 'Buscar Mecánico',
      descripcion: 'Encuentra mecánicos cerca de ti',
      icono: '🔧',
      color: '#2196F3',
      accion: () => {
        navigate('/servicios', { state: { tabActiva: 'lista', filtroTipo: 'mecanico' } });
      }
    },
    {
      titulo: user?.userType === 'cliente' ? 'Ver Todos los Servicios' : 'Ver Mis Servicios',
      descripcion: user?.userType === 'cliente' ? 'Explora servicios disponibles' : 'Revisa tus servicios activos',
      icono: '📋',
      color: '#4CAF50',
      accion: () => {
        if (user?.userType === 'cliente') {
          navigate('/servicios', { state: { tabActiva: 'lista' } });
        } else {
          navigate('/servicios', { state: { tabActiva: 'mis-servicios' } });
        }
      }
    },
    {
      titulo: 'Servicios Cercanos',
      descripcion: 'Explora servicios por ubicación',
      icono: '📍',
      color: '#9C27B0',
      accion: () => {
        navigate('/servicios', { state: { tabActiva: 'cercanos' } });
      }
    }
  ];

  const obtenerHorarioSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <div className="cliente-home">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cliente-home">
      {/* Sección de bienvenida */}
      <div className="welcome-section">
        <h1>{obtenerHorarioSaludo()}, {capitalizar(user?.username || 'Usuario')} 👋</h1>
        <p className="welcome-subtitle">¿En qué podemos ayudarte hoy?</p>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions-section">
        <h2>🚀 Acciones rápidas</h2>
        <div className="actions-grid">
          {accionesRapidas.map((accion, index) => (
            <div 
              key={index} 
              className="action-card"
              onClick={accion.accion}
              style={{ '--card-color': accion.color }}
            >
              <div className="action-icon">{accion.icono}</div>
              <div className="action-content">
                <h3>{accion.titulo}</h3>
                <p>{accion.descripcion}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      
      {/* Información útil */}
      <div className="quick-actions-section">
        <h2><span role="img" aria-label="información">ℹ️</span> Información útil</h2>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-header">
              <span className="info-icon">🚨</span>
              <h3>Servicios de Emergencia</h3>
            </div>
            <p>Para emergencias críticas, nuestros servicios están disponibles 24/7. Utiliza la opción "Urgente" al crear tu solicitud.</p>
          </div>
          <div className="info-card">
            <div className="info-header">
              <span className="info-icon">📱</span>
              <h3>Geolocalización</h3>
            </div>
            <p>Activa tu ubicación para encontrar los servicios más cercanos y obtener tiempos de respuesta más rápidos.</p>
          </div>
          <div className="info-card">
            <div className="info-header">
              <span className="info-icon">⭐</span>
              <h3>Calificaciones</h3>
            </div>
            <p>Después de cada servicio, podrás calificar a tu proveedor para ayudar a otros usuarios.</p>
          </div>
        </div>
      </div>

      {/* Botón de ayuda */}
      <div className="help-section">
        <p>¿Necesitas ayuda? <strong>Estamos aquí para apoyarte</strong></p>
        <button className="btn-help" onClick={() => navigate('')}>
          💬 Centro de Ayuda
        </button>
      </div>
    </div>
  );
}

export default HomeCliente;