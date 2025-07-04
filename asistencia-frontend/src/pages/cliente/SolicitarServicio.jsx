import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SolicitarServicio.css';

function SolicitarServicio() {
  const [servicio, setServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      servicio,
      descripcion,
      ubicacion,
    };

    try {
      const res = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert('Solicitud enviada con éxito ✅');
        navigate('/cliente/mis-solicitudes');
      } else {
        alert('Error al enviar la solicitud ❌');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo conectar con el servidor ⚠️');
    }
  };

  return (
    <div className="solicitar-servicio">
      <h2>📝 Solicitar un servicio</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tipo de servicio"
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          required
        />

        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>

        <input
          type="text"
          placeholder="Ubicación"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          required
        />

        <button type="submit">📤 Enviar solicitud</button>
      </form>
    </div>
  );
}

export default SolicitarServicio;