import { useEffect, useState } from 'react';
import API from '../services/api';

const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const res = await API.get('/proveedores');
        setProveedores(res.data);
      } catch (error) {
        console.error(error);
        alert('Error al cargar proveedores');
      }
    };

    obtenerProveedores();
  }, []);

  return (
    <div>
      <h2>📋 Lista de Proveedores</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Latitud</th>
            <th>Longitud</th>
            <th>Radio (km)</th>
            <th>Disponible</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.tipo}</td>
              <td>{p.latitud}</td>
              <td>{p.longitud}</td>
              <td>{p.radioKm}</td>
              <td>{p.disponible ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProveedores;