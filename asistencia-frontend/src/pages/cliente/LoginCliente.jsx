import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginCliente.css';
import axios from 'axios';


function LoginCliente() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        email,
        password,
      });

      const { token, user_type } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user_type', user_type);

      alert('Inicio de sesión exitoso 🎉');

      if (user_type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/cliente/home');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al iniciar sesión ❌');
    }
  };

  return (
    <div className="login-cliente">
      <h2>🔐 Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
      </form>
      <div className="login-extra">
        <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
      </div>
    </div>
  );
}

export default LoginCliente;
