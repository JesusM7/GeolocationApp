import React, { useState, useEffect } from 'react';
import { serviciosApi } from '../../services/serviciosApi';
import ServicioCard from './ServicioCard';
import FiltrosServicios from './FiltrosServicios';
import './ListaServicios.css';

const ListaServicios = ({ filtroInicial = null }) => {
  const [servicios, setServicios] = useState([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: filtroInicial || '',
    ciudad: '',
    disponible: true
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [servicios, filtros]);

  // Efecto para aplicar filtro inicial cuando cambie
  useEffect(() => {
    if (filtroInicial) {
      setFiltros(prev => ({
        ...prev,
        tipo: filtroInicial
      }));
    }
  }, [filtroInicial]);

  const cargarServicios = async () => {
    try {
      setLoading(true);
      const data = await serviciosApi.obtenerServicios();
      setServicios(data.servicios);
      setError(null);
    } catch (err) {
      setError('Error al cargar los servicios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let serviciosFiltrados = [...servicios];

    if (filtros.tipo) {
      serviciosFiltrados = serviciosFiltrados.filter(
        servicio => servicio.tipoServicio === filtros.tipo
      );
    }

    if (filtros.ciudad) {
      serviciosFiltrados = serviciosFiltrados.filter(
        servicio => servicio.ciudad.toLowerCase().includes(filtros.ciudad.toLowerCase())
      );
    }

    if (filtros.disponible !== null) {
      serviciosFiltrados = serviciosFiltrados.filter(
        servicio => servicio.disponible === filtros.disponible
      );
    }

    setServiciosFiltrados(serviciosFiltrados);
  };

  const handleFiltroChange = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
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
      <div className="lista-servicios-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando servicios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-servicios-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={cargarServicios}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="lista-servicios-container">
      <div className="header">
        <h1>Servicios Disponibles</h1>
        <p>Encuentra servicios de grúa y mecánica cerca de ti</p>
      </div>

      <FiltrosServicios 
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
      />

      <div className="servicios-stats">
        <p>
          Mostrando {serviciosFiltrados.length} de {servicios.length} servicios
        </p>
      </div>

      {serviciosFiltrados.length === 0 ? (
        <div className="no-servicios">
          <h3>No se encontraron servicios</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="servicios-grid">
          {serviciosFiltrados.map(servicio => (
            <ServicioCard
              key={servicio.id}
              servicio={servicio}
              onEliminar={handleServicioEliminado}
              onDisponibilidadCambiada={handleDisponibilidadCambiada}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaServicios; 