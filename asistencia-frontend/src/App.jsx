import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CrearSolicitud from './pages/CrearSolicitud';
import RegistrarProveedor from './pages/RegistrarProveedor';
import VerProveedores from './pages/VerProveedores';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to="/">Inicio</Link>
        <Link to="/crear">Crear Solicitud</Link>
        <Link to="/registrar">Registrar Proveedor</Link>
        <Link to="/proveedores">Ver Proveedores</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Bienvenido a la app de Servicios Automovilisticos</h1>} />
        <Route path="/crear" element={<CrearSolicitud />} />
        <Route path="/registrar" element={<RegistrarProveedor />} />
        <Route path="/proveedores" element={<VerProveedores />} />
      </Routes>
    </Router>
  );
}

export default App;
