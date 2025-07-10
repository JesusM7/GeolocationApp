import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedComponent from './components/ProtectedComponent';
import Navbar from './components/Navbar';
import JWTDebugInfo from './components/JWTDebugInfo';

import CrearSolicitud from './pages/CrearSolicitud';
import RegistrarProveedor from './pages/RegistrarProveedor';
import VerProveedores from './pages/VerProveedores';
import HomeCliente from './pages/HomeCliente';
import SolicitarServicio from './pages/cliente/SolicitarServicio';
import LoginCliente from './pages/cliente/LoginCliente';
import RegisterCliente from './pages/cliente/RegisterCliente';
import LandingPage from './pages/LandingPage';
import ServiciosPage from './pages/servicios/ServiciosPage';
import EditarServicio from './pages/servicios/EditarServicio';
import PanelAdministracion from './pages/admin/PanelAdministracion';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginCliente />} />
          <Route path="/register" element={<RegisterCliente />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/crear" 
            element={
              <ProtectedComponent allowedRoles={['cliente', 'mecanico', 'grua', 'admin']}>
                <CrearSolicitud />
              </ProtectedComponent>
            } 
          />
          <Route 
            path="/registrar" 
            element={
              <ProtectedComponent allowedRoles={['admin', 'mecanico', 'grua']}>
                <RegistrarProveedor />
              </ProtectedComponent>
            } 
          />
          <Route 
            path="/proveedores" 
            element={
              <ProtectedComponent allowedRoles={['admin', 'cliente', 'mecanico', 'grua']}>
                <VerProveedores />
              </ProtectedComponent>
            } 
          />
          <Route 
            path="/cliente/home" 
            element={
              <ProtectedComponent allowedRoles={['cliente', 'mecanico', 'grua', 'admin']}>
                <HomeCliente />
              </ProtectedComponent>
            } 
          />
          <Route 
            path="/cliente/solicitar" 
            element={
              <ProtectedComponent allowedRoles={['cliente', 'admin']}>
                <SolicitarServicio />
              </ProtectedComponent>
            } 
          />
          <Route 
            path="/servicios" 
            element={
              <ProtectedComponent allowedRoles={['admin', 'cliente', 'mecanico', 'grua']}>
                <ServiciosPage />
              </ProtectedComponent>
            } 
          />
          <Route 
            path="/servicios/editar/:id" 
            element={
              <ProtectedComponent allowedRoles={['mecanico', 'grua', 'admin']}>
                <EditarServicio />
              </ProtectedComponent>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedComponent allowedRoles={['admin']}>
                <PanelAdministracion />
              </ProtectedComponent>
            } 
          />
          
          {/* Ruta para usuarios no autorizados */}
          <Route 
            path="/unauthorized" 
            element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>🚫 Acceso No Autorizado</h2>
                <p>No tienes permisos para acceder a esta página.</p>
                <button onClick={() => window.history.back()}>Volver</button>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
