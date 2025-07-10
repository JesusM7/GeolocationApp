import React, { useState, useEffect } from 'react';
import { serviciosApi } from '../../services/serviciosApi';
import ServicioCard from './ServicioCard';
import { useAuthContext } from '../../context/AuthContext';
import { getRoleDisplayName } from '../../utils/roleUtils';
import './MisServicios.css';

const MisServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    cargarMisServicios();
  }, []);

  const cargarMisServicios = async () => {
    try {
      setLoading(true);
      const data = await serviciosApi.obtenerMisServicios();
      setServicios(data.servicios);
      setError(null);
    } catch (err) {
      setError('Error al cargar tus servicios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleServicioEliminado = (servicioId) => {
    setServicios(servicios.filter(s => s.id !== servicioId));
  };

  const handleDisponibilidadCambiada = (servicioId, nuevaDisponibilidad) => {
    setServicios(servicios.map(s => 
      s.id === servicioId ? { ...s, disponible: nuevaDisponibilidad } : s
    ));
  };

  if (loading) {
    return (
      <div className="mis-servicios-loading">
        <div className="spinner"></div>
        <p>Cargando tus servicios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-servicios-error">
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button onClick={cargarMisServicios} className="btn btn-primary">
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mis-servicios">
      <div className="mis-servicios-header">
        <h2>Mis Servicios</h2>
      
      </div>

      {servicios.length === 0 ? (
        <div className="no-servicios">
          <h3>📝 No tienes servicios publicados</h3>
          <p>¡Comienza publicando tu primer servicio para ofrecer tus servicios a otros usuarios!</p>
        </div>
      ) : (
        <div className="servicios-grid">
          {servicios.map(servicio => (
            <ServicioCard
              key={servicio.id}
              servicio={servicio}
              onEliminar={handleServicioEliminado}
              onDisponibilidadCambiada={handleDisponibilidadCambiada}
            />
          ))}
        </div>
      )}

      <div className="mis-servicios-stats">
        <div className="stat">
          <span className="stat-number">{servicios.length}</span>
          <span className="stat-label">Total de servicios</span>
        </div>
        <div className="stat">
          <span className="stat-number">{servicios.filter(s => s.disponible).length}</span>
          <span className="stat-label">Disponibles</span>
        </div>
        <div className="stat">
          <span className="stat-number">{servicios.filter(s => !s.disponible).length}</span>
          <span className="stat-label">No disponibles</span>
        </div>
      </div>
    </div>
  );
};

export default MisServicios; 