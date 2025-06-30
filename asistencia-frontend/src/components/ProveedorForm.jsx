import { useState } from 'react';
import API from '../services/api';

const ProveedorForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    latitud: '',
    longitud: '',
    radioKm: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/proveedores/registrar', {
        nombre: form.nombre,
        tipo: form.tipo.trim().toLowerCase(),
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        radioKm: parseFloat(form.radioKm)
      });

      alert(`✅ Proveedor registrado: ${response.data.proveedor.nombre}`);
    } catch (error) {
      console.error(error);
      alert('⚠️ Error al registrar proveedor');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h2>Registrar proveedor</h2>
      <input name="nombre" placeholder="Nombre del proveedor" onChange={handleChange} />
      <input name="tipo" placeholder="Tipo (grua, mecanico...)" onChange={handleChange} />
      <input name="latitud" placeholder="Latitud" onChange={handleChange} />
      <input name="longitud" placeholder="Longitud" onChange={handleChange} />
      <input name="radioKm" placeholder="Radio en kilómetros" onChange={handleChange} />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default ProveedorForm;