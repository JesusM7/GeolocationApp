import { useState } from 'react';
import API from '../services/api';

const SolicitudForm = () => {
  const [form, setForm] = useState({
    tipoServicio: '',
    latitud: '',
    longitud: '',
    clienteId: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await API.post('/solicitudes', {
        tipoServicio: form.tipoServicio.trim().toLowerCase(),
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        clienteId: parseInt(form.clienteId)
      });

      alert(`✅ Solicitud creada con ID: ${response.data.id}`);
    } catch (error) {
      console.error(error);
      alert('⚠️ Error al crear la solicitud');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Crear nueva solicitud</h2>
      <input name="tipoServicio" placeholder="Tipo de servicio (grua, mecanico...)" onChange={handleChange} />
      <input name="latitud" placeholder="Latitud" onChange={handleChange} />
      <input name="longitud" placeholder="Longitud" onChange={handleChange} />
      <input name="clienteId" placeholder="ID del cliente" onChange={handleChange} />
      <button type="submit">Enviar solicitud</button>
    </form>
  );
};

export default SolicitudForm;