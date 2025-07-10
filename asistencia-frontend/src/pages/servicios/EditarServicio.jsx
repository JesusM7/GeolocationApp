import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormularioServicio from '../../components/servicios/FormularioServicio';

const EditarServicio = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleGuardar = (servicioActualizado) => {
    alert('✅ Servicio actualizado exitosamente');
    navigate('/servicios');
  };

  const handleCancelar = () => {
    navigate('/servicios');
  };

  return (
    <div className="editar-servicio-container">
      <div className="container">
        <div style={{ padding: '2rem 0' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
              ✏️ Editar Servicio
            </h1>
            <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>
              Modifica los datos de tu servicio
            </p>
          </div>

          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <FormularioServicio
              servicioId={id}
              onGuardar={handleGuardar}
              onCancelar={handleCancelar}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarServicio; 