import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CrearSolicitud from './pages/CrearSolicitud';
import RegistrarProveedor from './pages/RegistrarProveedor';
import VerProveedores from './pages/VerProveedores';
import HomeCliente from './pages/HomeCliente';
import SolicitarServicio from './pages/cliente/SolicitarServicio';
import LoginCliente from './pages/cliente/LoginCliente';
import RegisterCliente from './pages/cliente/RegisterCliente';
import LandingPage from './pages/LandingPage';



function App() {
  return (
    <Router>
      {/* <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to="/">Inicio</Link>
        <Link to="/crear">Crear Solicitud</Link>
        <Link to="/registrar">Registrar Proveedor</Link>
        <Link to="/proveedores">Ver Proveedores</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginCliente />} />
        <Route path="/register" element={<RegisterCliente />} />
        <Route path="/crear" element={<CrearSolicitud />} />
        <Route path="/registrar" element={<RegistrarProveedor />} />
        <Route path="/proveedores" element={<VerProveedores />} />
        <Route path="/cliente/home" element={<HomeCliente />} />
        <Route path="/cliente/solicitar" element={<SolicitarServicio />} />
      </Routes>
    </Router>
  );
}

export default App;
