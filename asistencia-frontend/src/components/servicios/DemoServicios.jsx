import React, { useState } from 'react';
import { serviciosApi } from '../../services/serviciosApi';

const DemoServicios = () => {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const serviciosEjemplo = [
    {
      tipoServicio: "grua",
      titulo: "Grúa 24 Horas - Servicio Express",
      descripcion: "Servicio de grúa disponible las 24 horas. Atendemos emergencias vehiculares, remolque de autos, motos y vehículos medianos. Personal especializado y equipos certificados.",
      precio: 80000,
      nombreProveedor: "Carlos Rodríguez",
      telefonoProveedor: "+573123456789",
      emailProveedor: "carlos.grua@email.com",
      cedulaProveedor: "80123456",
      latitud: 4.7110,
      longitud: -74.0721,
      direccion: "Carrera 15 #85-20, Zona Rosa",
      ciudad: "Bogotá",
      cobertura: 25,
      horarioInicio: "00:00",
      horarioFin: "23:59",
      diasDisponibles: "L,M,X,J,V,S,D"
    },
    {
      tipoServicio: "mecanico",
      titulo: "Mecánica a Domicilio - Reparaciones Express",
      descripcion: "Servicio de mecánica a domicilio especializado en diagnóstico, cambio de aceite, reparación de frenos, mantenimiento preventivo y correctivo. Atención inmediata.",
      precio: 45000,
      nombreProveedor: "Ana García",
      telefonoProveedor: "+573198765432",
      emailProveedor: "ana.mecanica@email.com",
      cedulaProveedor: "53987654",
      latitud: 4.6482,
      longitud: -74.0776,
      direccion: "Calle 72 #10-50, Chapinero",
      ciudad: "Bogotá",
      cobertura: 20,
      horarioInicio: "07:00",
      horarioFin: "19:00",
      diasDisponibles: "L,M,X,J,V,S"
    },
    {
      tipoServicio: "grua",
      titulo: "Grúa Pesada Industrial",
      descripcion: "Especialistas en grúa pesada para vehículos industriales, camiones, buses y maquinaria pesada. Equipos de alta capacidad y personal certificado.",
      precio: 150000,
      nombreProveedor: "Miguel Torres",
      telefonoProveedor: "+573156789012",
      emailProveedor: "miguel.grua@email.com",
      cedulaProveedor: "15678901",
      latitud: 4.5981,
      longitud: -74.0758,
      direccion: "Autopista Sur Km 12",
      ciudad: "Bogotá",
      cobertura: 40,
      horarioInicio: "06:00",
      horarioFin: "22:00",
      diasDisponibles: "L,M,X,J,V,S"
    },
    {
      tipoServicio: "mecanico",
      titulo: "Taller Multimarca - Servicio Premium",
      descripcion: "Taller especializado en todas las marcas con tecnología de punta. Diagnóstico computarizado, reparaciones complejas, pintura y latonería.",
      precio: 60000,
      nombreProveedor: "Roberto Martínez",
      telefonoProveedor: "+573167890123",
      emailProveedor: "roberto.taller@email.com",
      cedulaProveedor: "16789012",
      latitud: 4.6097,
      longitud: -74.0817,
      direccion: "Calle 26 #68-15",
      ciudad: "Bogotá",
      cobertura: 15,
      horarioInicio: "08:00",
      horarioFin: "18:00",
      diasDisponibles: "L,M,X,J,V"
    }
  ];

  const crearServicioDemo = async (servicio) => {
    try {
      setLoading(true);
      await serviciosApi.crearServicio(servicio);
      setMensaje(`Servicio "${servicio.titulo}" creado exitosamente`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      setMensaje(`Error al crear servicio: ${error}`);
      setTimeout(() => setMensaje(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const crearTodosLosServicios = async () => {
    try {
      setLoading(true);
      setMensaje('Creando servicios de ejemplo...');
      
      for (const servicio of serviciosEjemplo) {
        await serviciosApi.crearServicio(servicio);
      }
      
      setMensaje(`${serviciosEjemplo.length} servicios creados exitosamente`);
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      setMensaje(`Error al crear servicios: ${error}`);
      setTimeout(() => setMensaje(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px', 
      margin: '20px 0',
      border: '2px dashed #dee2e6'
    }}>
      <h3 style={{ color: '#495057', marginBottom: '15px' }}>
        🧪 Demo - Crear Servicios de Ejemplo
      </h3>
      
      {mensaje && (
        <div style={{
          padding: '10px 15px',
          backgroundColor: mensaje.includes('Error') ? '#f8d7da' : '#d4edda',
          color: mensaje.includes('Error') ? '#721c24' : '#155724',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          {mensaje}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button
          onClick={crearTodosLosServicios}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {loading ? 'Creando...' : '🚀 Crear Todos los Servicios'}
        </button>

        {serviciosEjemplo.map((servicio, index) => (
          <button
            key={index}
            onClick={() => crearServicioDemo(servicio)}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: servicio.tipoServicio === 'grua' ? '#28a745' : '#ffc107',
              color: servicio.tipoServicio === 'grua' ? 'white' : '#212529',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {servicio.tipoServicio === 'grua' ? '🚛' : '🔧'} {servicio.titulo.substring(0, 20)}...
          </button>
        ))}
      </div>

      <p style={{ 
        fontSize: '0.9rem', 
        color: '#6c757d', 
        marginTop: '15px',
        fontStyle: 'italic'
      }}>
        💡 Usa estos botones para crear servicios de ejemplo y probar la funcionalidad
      </p>
    </div>
  );
};

export default DemoServicios; 