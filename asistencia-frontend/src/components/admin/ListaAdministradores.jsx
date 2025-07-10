import { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';
import './ListaAdministradores.css';

const ListaAdministradores = ({ refreshTrigger }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarAdministradores();
  }, [refreshTrigger]);

  const cargarAdministradores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.obtenerAdministradores();
      setAdmins(data.admins || []);
    } catch (err) {
      console.error('Error al cargar administradores:', err);
      setError('Error al cargar la lista de administradores');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="lista-admins-loading">
        <div className="spinner"></div>
        <p>Cargando administradores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lista-admins-error">
        <h3>⚠️ Error</h3>
        <p>{error}</p>
        <button 
          className="btn btn-primary"
          onClick={cargarAdministradores}
        >
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="lista-administradores">
      <div className="lista-header">
        <h3>👥 Administradores del Sistema</h3>
        <p>Total: {admins.length} administrador(es)</p>
      </div>

      {admins.length === 0 ? (
        <div className="no-admins">
          <p>No hay administradores registrados.</p>
        </div>
      ) : (
        <div className="admins-grid">
          {admins.map(admin => (
            <div key={admin.id} className="admin-card">
              <div className="admin-avatar">
                <span>{admin.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="admin-info">
                <h4>{admin.username} {admin.last_name || ''}</h4>
                <p className="admin-email">📧 {admin.email}</p>
                <p className="admin-phone">📞 {admin.phone}</p>
                <p className="admin-created">
                  📅 Registrado: {formatearFecha(admin.createdAt)}
                </p>
              </div>
              <div className="admin-badge">
                <span className="badge-admin">🔐 ADMIN</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaAdministradores; 