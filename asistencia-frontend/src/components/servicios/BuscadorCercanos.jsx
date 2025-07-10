import React, { useState, useEffect } from 'react';
import { serviciosApi } from '../../services/serviciosApi';
import ServicioCard from './ServicioCard';
import './BuscadorCercanos.css';

const BuscadorCercanos = () => {
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [serviciosCercanos, setServiciosCercanos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [filtros, setFiltros] = useState({
    tipo: '',
    radioMaximo: 20
  });

  useEffect(() => {
    obtenerUbicacionUsuario();
  }, []);

  const obtenerUbicacionUsuario = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const ubicacion = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude
          };
          setUbicacionUsuario(ubicacion);
          buscarServiciosCercanos(ubicacion.latitud, ubicacion.longitud);
        },
        (error) => {
          setError('Error al obtener ubicación: ' + error.message);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    } else {
      setError('Geolocalización no soportada por este navegador');
      setLoading(false);
    }
  };

  const buscarServiciosCercanos = async (lat, lng, tipo = null, radio = 30) => {
    try {
      setLoading(true);
      setError(null);
      
      let debug = {
        ubicacionUsuario: { lat, lng },
        filtros: { tipo, radio },
        timestamp: new Date().toISOString()
      };

      // Intentar primero el endpoint específico de cercanos
      let servicios = [];
      let usandoFallback = false;
      
      try {
        console.log('🔍 Intentando endpoint /servicios/cercanos...');
        const data = await serviciosApi.buscarServiciosCercanos(lat, lng, tipo, radio);
        console.log('✅ Respuesta del endpoint cercanos:', data);
        
        // FIX: Buscar en serviciosEncontrados en lugar de servicios
        servicios = Array.isArray(data) ? data : (data?.serviciosEncontrados || data?.servicios || []);
        
        debug.endpointCercanos = {
          exitoso: true,
          respuesta: data,
          serviciosEncontrados: servicios.length
        };
        
        console.log('🎯 Servicios extraídos:', servicios);
        
      } catch (cercanosError) {
        console.log('❌ Endpoint cercanos falló:', cercanosError);
        usandoFallback = true;
        
        debug.endpointCercanos = {
          exitoso: false,
          error: cercanosError.message || cercanosError
        };
        
        // Fallback: obtener todos los servicios y filtrar por distancia
        console.log('🔄 Usando fallback - obteniendo todos los servicios...');
        const todosLosServicios = await serviciosApi.obtenerServicios();
        console.log('📊 Todos los servicios obtenidos:', todosLosServicios);
        
        const serviciosDisponibles = Array.isArray(todosLosServicios) ? todosLosServicios : (todosLosServicios?.servicios || []);
        
        debug.fallback = {
          serviciosTotales: serviciosDisponibles.length,
          estructura: todosLosServicios,
          serviciosConCoordenadas: serviciosDisponibles.filter(s => s.latitud && s.longitud).length
        };

        console.log(`📍 Servicios con coordenadas: ${debug.fallback.serviciosConCoordenadas}/${debug.fallback.serviciosTotales}`);
        
        // Filtrar por distancia y tipo
        servicios = serviciosDisponibles
          .filter(servicio => {
            // Verificar que el servicio tenga coordenadas válidas
            if (!servicio.latitud || !servicio.longitud) {
              console.log(`❌ Servicio sin coordenadas: ${servicio.titulo}`);
              return false;
            }
            
            // Filtrar por tipo si se especifica
            if (tipo && servicio.tipoServicio !== tipo) {
              console.log(`🔍 Servicio filtrado por tipo: ${servicio.titulo} (${servicio.tipoServicio} != ${tipo})`);
              return false;
            }
            
            // Calcular distancia y filtrar por radio
            const distancia = calcularDistancia(lat, lng, servicio.latitud, servicio.longitud);
            console.log(`📏 Distancia a ${servicio.titulo}: ${distancia} km`);
            
            if (distancia <= radio) {
              console.log(`✅ Servicio dentro del radio: ${servicio.titulo} (${distancia} km)`);
              return true;
            } else {
              console.log(`❌ Servicio fuera del radio: ${servicio.titulo} (${distancia} km > ${radio} km)`);
              return false;
            }
          })
          .sort((a, b) => {
            // Ordenar por distancia (más cercanos primero)
            const distanciaA = calcularDistancia(lat, lng, a.latitud, a.longitud);
            const distanciaB = calcularDistancia(lat, lng, b.latitud, b.longitud);
            return distanciaA - distanciaB;
          });

        debug.fallback.serviciosFiltrados = servicios.length;
      }

      debug.resultado = {
        usandoFallback,
        serviciosFinales: servicios.length,
        servicios: servicios.map(s => ({
          id: s.id,
          titulo: s.titulo,
          tipo: s.tipoServicio,
          coordenadas: { lat: s.latitud, lng: s.longitud },
          distancia: calcularDistancia(lat, lng, s.latitud, s.longitud)
        }))
      };

      console.log('🎯 Resultado final:', debug.resultado);
      setDebugInfo(debug);
      setServiciosCercanos(servicios);
    } catch (err) {
      console.error('💥 Error general:', err);
      setError('Error al buscar servicios cercanos: ' + err.message);
      setServiciosCercanos([]);
      setDebugInfo({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);
    
    if (ubicacionUsuario) {
      buscarServiciosCercanos(
        ubicacionUsuario.latitud,
        ubicacionUsuario.longitud,
        nuevosFiltros.tipo || null,
        nuevosFiltros.radioMaximo
      );
    }
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return Math.round(d * 10) / 10; // Redondear a 1 decimal
  };

  const handleServicioEliminado = (servicioId) => {
    if (Array.isArray(serviciosCercanos)) {
      setServiciosCercanos(serviciosCercanos.filter(s => s.id !== servicioId));
    }
  };

  const handleDisponibilidadCambiada = (servicioId, nuevaDisponibilidad) => {
    if (Array.isArray(serviciosCercanos)) {
      setServiciosCercanos(serviciosCercanos.map(s => 
        s.id === servicioId ? { ...s, disponible: nuevaDisponibilidad } : s
      ));
    }
  };

  if (loading && !ubicacionUsuario) {
    return (
      <div className="buscador-cercanos-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Obteniendo tu ubicación...</p>
        </div>
      </div>
    );
  }

  if (error && !ubicacionUsuario) {
    return (
      <div className="buscador-cercanos-container">
        <div className="error">
          <h3>No se pudo obtener tu ubicación</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={obtenerUbicacionUsuario}
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="buscador-cercanos-container">
      <div className="header">
        <h1>Servicios Cerca de Ti</h1>
        {ubicacionUsuario && (
          <p className="ubicacion-actual">
            📍 Tu ubicación actual: {ubicacionUsuario.latitud.toFixed(4)}, {ubicacionUsuario.longitud.toFixed(4)}
          </p>
        )}
      </div>

      <div className="filtros-cercanos">
        <div className="filtro-grupo">
          <label htmlFor="tipo-servicio">Tipo de Servicio</label>
          <select
            id="tipo-servicio"
            value={filtros.tipo}
            onChange={(e) => handleFiltroChange('tipo', e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="grua">🚛 Grúa</option>
            <option value="mecanico">🔧 Mecánico</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="radio-maximo">Radio máximo (km)</label>
          <select
            id="radio-maximo"
            value={filtros.radioMaximo}
            onChange={(e) => handleFiltroChange('radioMaximo', parseInt(e.target.value))}
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={15}>15 km</option>
            <option value={20}>20 km</option>
            <option value={30}>30 km</option>
            <option value={50}>50 km</option>
            <option value={100}>100 km</option>
            <option value={200}>200 km</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={obtenerUbicacionUsuario}
          disabled={loading}
        >
          🔄 Actualizar Ubicación
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Buscando servicios cercanos...</p>
        </div>
      ) : error ? (
        <div className="error">
          <h3>Error al cargar servicios</h3>
          <p>{error}</p>
          <div style={{ marginTop: '15px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => {
                if (ubicacionUsuario) {
                  buscarServiciosCercanos(
                    ubicacionUsuario.latitud,
                    ubicacionUsuario.longitud,
                    filtros.tipo || null,
                    filtros.radioMaximo
                  );
                }
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="resultados-stats">
            <p>
              Se encontraron {Array.isArray(serviciosCercanos) ? serviciosCercanos.length : 0} servicios dentro de {filtros.radioMaximo} km
            </p>
            {process.env.NODE_ENV === 'development' && debugInfo.resultado && (
              <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}></p>
            )}
          </div>

          {Array.isArray(serviciosCercanos) && serviciosCercanos.length > 0 ? (
            <div className="servicios-cercanos-grid">
              {serviciosCercanos.map(servicio => {
                const distancia = ubicacionUsuario ? 
                  calcularDistancia(
                    ubicacionUsuario.latitud,
                    ubicacionUsuario.longitud,
                    servicio.latitud,
                    servicio.longitud
                  ) : null;

                return (
                  <div key={servicio.id} className="servicio-con-distancia">
                   
                    <ServicioCard
                      servicio={servicio}
                      onEliminar={handleServicioEliminado}
                      onDisponibilidadCambiada={handleDisponibilidadCambiada}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-servicios">
              <h3>No se encontraron servicios cercanos</h3>
              <p>Intenta aumentar el radio de búsqueda o cambiar el tipo de servicio</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BuscadorCercanos; 