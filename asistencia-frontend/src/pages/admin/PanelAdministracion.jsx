import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import RegistrarAdminForm from '../../components/admin/RegistrarAdminForm';
import ListaAdministradores from '../../components/admin/ListaAdministradores';
import './PanelAdministracion.css';

const PanelAdministracion = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('lista');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Verificar que el usuario sea administrador
  if (!user || user.userType !== 'admin') {
    return (
      <div className="panel-admin-error">
        <h2>🚫 Acceso Denegado</h2>
        <p>Solo los administradores pueden acceder a este panel.</p>
        <p><strong>Tu rol actual:</strong> {user?.userType || 'No autenticado'}</p>
      </div>
    );
  }

  const handleRegistroExitoso = (result) => {
    setSuccessMessage(`✅ Administrador ${result.admin.username} registrado exitosamente`);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh de la lista
    setActiveTab('lista'); // Cambiar a la pestaña de lista
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleCancelarRegistro = () => {
    setActiveTab('lista');
  };

  return (
    <div className="panel-administracion">
      <div className="panel-header">
        <h1>⚙️ Panel de Administración</h1>
        <p>Gestión de administradores del sistema</p>
        <div className="admin-info">
          <span>Conectado como: <strong>{user.username}</strong> ({user.email})</span>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="panel-tabs">
        <button 
          className={`tab-button ${activeTab === 'lista' ? 'active' : ''}`}
          onClick={() => setActiveTab('lista')}
        >
          👥 Lista de Administradores
        </button>
        <button 
          className={`tab-button ${activeTab === 'registro' ? 'active' : ''}`}
          onClick={() => setActiveTab('registro')}
        >
          ➕ Registrar Administrador
        </button>
      </div>

      <div className="panel-content">
        {activeTab === 'lista' && (
          <div className="tab-content">
            <ListaAdministradores refreshTrigger={refreshTrigger} />
          </div>
        )}
        
        {activeTab === 'registro' && (
          <div className="tab-content">
            <RegistrarAdminForm 
              onSuccess={handleRegistroExitoso}
              onCancel={handleCancelarRegistro}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAdministracion; 