import React from 'react';
import './FiltrosServicios.css';

const FiltrosServicios = ({ filtros, onFiltroChange }) => {
  const handleInputChange = (campo, valor) => {
    onFiltroChange({
      ...filtros,
      [campo]: valor
    });
  };

  const limpiarFiltros = () => {
    onFiltroChange({
      tipo: '',
      ciudad: '',
      disponible: true
    });
  };

  return (
    <div className="filtros-servicios">
      <h3>Filtrar Servicios</h3>
      
      <div className="filtros-grid">
        <div className="filtro-grupo">
          <label htmlFor="tipo-servicio">Tipo de Servicio</label>
          <select
            id="tipo-servicio"
            value={filtros.tipo}
            onChange={(e) => handleInputChange('tipo', e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="grua">🚛 Grúa</option>
            <option value="mecanico">🔧 Mecánico</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label htmlFor="ciudad">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            placeholder="Buscar por ciudad..."
            value={filtros.ciudad}
            onChange={(e) => handleInputChange('ciudad', e.target.value)}
          />
        </div>

        <div className="filtro-grupo">
          <label htmlFor="disponibilidad">Disponibilidad</label>
          <select
            id="disponibilidad"
            value={filtros.disponible}
            onChange={(e) => {
              const valor = e.target.value === 'true' ? true : 
                           e.target.value === 'false' ? false : null;
              handleInputChange('disponible', valor);
            }}
          >
            <option value={true}>Solo disponibles</option>
            <option value={false}>Solo no disponibles</option>
            <option value="">Todos</option>
          </select>
        </div>

        <div className="filtro-acciones">
          <button
            className="btn btn-secondary"
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltrosServicios; 