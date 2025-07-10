import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviciosApi } from '../../services/serviciosApi';
import { useAuthContext } from '../../context/AuthContext';
import './ServicioCard.css';

const ServicioCard = ({ servicio, onEliminar, onDisponibilidadCambiada }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Verificar si el usuario actual es el propietario del servicio
  const esServicioPropio = user && servicio.userId === user.id;
  
  // Verificar si el usuario es administrador
  const esAdministrador = user && user.userType === 'admin';
  
  // Verificar si puede gestionar el servicio (propietario o admin)
  const puedeGestionar = esServicioPropio || esAdministrador;

  const handleToggleDisponibilidad = async () => {
    try {
      setLoading(true);
      await serviciosApi.cambiarDisponibilidad(servicio.id, !servicio.disponible);
      onDisponibilidadCambiada(servicio.id, !servicio.disponible);
    } catch (error) {
      alert('Error al cambiar disponibilidad: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        setLoading(true);
        await serviciosApi.eliminarServicio(servicio.id);
        onEliminar(servicio.id);
      } catch (error) {
        alert('Error al eliminar servicio: ' + error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditar = () => {
    navigate(`/servicios/editar/${servicio.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatHorario = (inicio, fin) => {
    return `${inicio} - ${fin}`;
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'grua':
        return '🚛';
      case 'mecanico':
        return '🔧';
      default:
        return '🛠️';
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'grua':
        return 'Grúa';
      case 'mecanico':
        return 'Mecánico';
      default:
        return 'Servicio';
    }
  };

  return (
    <div className={`servicio-card ${!servicio.disponible ? 'no-disponible' : ''}`}>
      <div className="card-header">
        <div className="tipo-servicio">
          <span className="tipo-icon">{getTipoIcon(servicio.tipoServicio)}</span>
          <span className="tipo-label">{getTipoLabel(servicio.tipoServicio)}</span>
        </div>
        <div className={`disponibilidad ${servicio.disponible ? 'disponible' : 'no-disponible'}`}>
          {servicio.disponible ? 'Disponible' : 'No disponible'}
        </div>
      </div>

      {servicio.fotoUrl && (
        <div className="card-image">
          <img src={servicio.fotoUrl} alt={servicio.titulo} />
        </div>
      )}

      <div className="card-content">
        <h3 className="titulo">{servicio.titulo}</h3>
        <p className="descripcion">{servicio.descripcion}</p>
        
        <div className="precio">
          <span className="precio-valor">{formatPrice(servicio.precio)}</span>
        </div>

        <div className="proveedor-info">
          <h4>Proveedor</h4>
          <p><strong>{servicio.nombreProveedor}</strong></p>
          <p>📞 {servicio.telefonoProveedor}</p>
          <p>✉️ {servicio.emailProveedor}</p>
        </div>

        <div className="ubicacion-info">
          <h4>Ubicación</h4>
          <p>📍 {servicio.direccion}</p>
          <p>🏙️ {servicio.ciudad}</p>
          <p>📍 Cobertura: {servicio.cobertura} km</p>
        </div>

        <div className="horario-info">
          <h4>Horarios</h4>
          <p>🕐 {formatHorario(servicio.horarioInicio, servicio.horarioFin)}</p>
          <p>📅 {servicio.diasDisponibles}</p>
        </div>
      </div>

      <div className="card-actions">
        {/* Botones de contacto - solo para servicios que NO son propios */}
        {!esServicioPropio && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => window.open(`tel:${servicio.telefonoProveedor}`)}
            >
              📞 Llamar
            </button>
          </>
        )}

        {/* Botones de gestión - solo para el propietario del servicio */}
        {puedeGestionar && (
          <>
            {/* Botón de editar - solo para el propietario */}
            {esServicioPropio && (
              <button
                className="btn btn-info"
                onClick={handleEditar}
                disabled={loading}
              >
                ✏️ Editar
              </button>
            )}

            {/* Botón de disponibilidad - para propietario y administrador */}
            <button
              className={`btn ${servicio.disponible ? 'btn-warning' : 'btn-success'}`}
              onClick={handleToggleDisponibilidad}
              disabled={loading}
            >
              {loading ? 'Cargando...' : (servicio.disponible ? '⏸️ Pausar' : '▶️ Activar')}
            </button>

            {/* Botón de eliminar - para propietario y administrador */}
            <button
              className="btn btn-danger"
              onClick={handleEliminar}
              disabled={loading}
            >
              {loading ? 'Eliminando...' : '🗑️ Eliminar'}
            </button>
          </>
        )}

        {/* Mensaje informativo según el tipo de usuario */}
        {!puedeGestionar && (
          <div className="servicio-info">
            <small style={{ color: '#6c757d', fontStyle: 'italic' }}>
              📝 Puedes contactar directamente al proveedor
            </small>
          </div>
        )}

        {esServicioPropio && (
          <div className="servicio-info">
            <small style={{ color: '#28a745', fontStyle: 'italic' }}>
              🏠 Este es tu servicio - puedes gestionarlo aquí
            </small>
          </div>
        )}

        {esAdministrador && !esServicioPropio && (
          <div className="servicio-info">
            <small style={{ color: '#dc3545', fontStyle: 'italic' }}>
              ⚙️ Como administrador puedes eliminar este servicio
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicioCard; 