import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import ListaServicios from '../../components/servicios/ListaServicios';
import BuscadorCercanos from '../../components/servicios/BuscadorCercanos';
import FormularioServicio from '../../components/servicios/FormularioServicio';
import DemoServicios from '../../components/servicios/DemoServicios';
import MisServicios from '../../components/servicios/MisServicios';
import './ServiciosPage.css';

const ServiciosPage = () => {
  const [tabActiva, setTabActiva] = useState('lista');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [servicioEditando, setServicioEditando] = useState(null);
  const { user } = useAuthContext();
  const location = useLocation();

  // Efecto para manejar navegación con state
  useEffect(() => {
    if (location.state?.tabActiva) {
      const tabDeseada = location.state.tabActiva;
      const tabsDisponibles = getTabs().map(tab => tab.id);
      
      if (tabsDisponibles.includes(tabDeseada)) {
        setTabActiva(tabDeseada);
        if (tabDeseada === 'crear') {
          setMostrarFormulario(true);
        }
      }
    }
  }, [location.state]);

  // Definir tabs según el rol del usuario
  const getTabs = () => {
    const baseTabs = [
      { id: 'lista', nombre: 'Todos los Servicios', icono: '📋' },
      { id: 'cercanos', nombre: 'Servicios Cercanos', icono: '📍' }
    ];

    // Solo mecánicos, grúas y admins pueden crear servicios
    if (user?.userType && ['mecanico', 'grua', 'admin'].includes(user.userType)) {
      baseTabs.push(
        { id: 'mis-servicios', nombre: 'Mis Servicios', icono: '🏠' },
        { id: 'crear', nombre: 'Crear Servicio', icono: '➕' }
      );
    }

    return baseTabs;
  };

  const tabs = getTabs();

  const handleTabChange = (tabId) => {
    setTabActiva(tabId);
    if (tabId === 'crear') {
      setMostrarFormulario(true);
      setServicioEditando(null);
    } else {
      setMostrarFormulario(false);
      setServicioEditando(null);
    }
  };

  const handleServicioGuardado = (servicio) => {
    setMostrarFormulario(false);
    setServicioEditando(null);
    setTabActiva('lista');
    // Mostrar mensaje de éxito
    alert(`Servicio ${servicioEditando ? 'actualizado' : 'creado'} exitosamente`);
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setServicioEditando(null);
    setTabActiva('lista');
  };

  const renderContent = () => {
    if (mostrarFormulario) {
      return (
        <FormularioServicio
          servicioId={servicioEditando}
          onGuardar={handleServicioGuardado}
          onCancelar={handleCancelarFormulario}
        />
      );
    }

    switch (tabActiva) {
      case 'lista':
        return (
          <>
          
            <ListaServicios filtroInicial={location.state?.filtroTipo} />
          </>
        );
      case 'cercanos':
        return <BuscadorCercanos />;
      case 'mis-servicios':
        return <MisServicios />;
      default:
        return (
          <>
        
            <ListaServicios filtroInicial={location.state?.filtroTipo} />
          </>
        );
    }
  };

  return (
    <div className="servicios-page">


      <div className="servicios-navigation">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${tabActiva === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icono}</span>
              <span className="tab-name">{tab.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="servicios-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ServiciosPage; 