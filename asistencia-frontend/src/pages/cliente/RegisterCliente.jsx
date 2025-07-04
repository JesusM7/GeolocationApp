import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterCliente.css';
import axios from 'axios';


function RegisterCliente() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    last_name: '',
    phone: '',
    birth_date: '',
    user_type: 'customer',
    password: '',
    confirm_password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirm_password) {
    return alert('Las contraseñas no coinciden');
  }

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, form);

    alert('Registro exitoso 🎉');
    navigate('/login');
  } catch (error) {
    console.error('Error:', error);
    alert(error.response?.data?.message || 'Error en el registro ❌');
  }
};


  return (
    <div className="registro-cliente">
      <h2>🧾 Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Correo electrónico" required onChange={handleChange} />
        <input type="text" name="username" placeholder="Nombre" required onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Apellido" onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Teléfono" required onChange={handleChange} />
        <input type="date" name="birth_date" onChange={handleChange} />
        <select name="user_type" onChange={handleChange}>
          <option value="customer">Cliente</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" name="password" placeholder="Contraseña" required onChange={handleChange} />
        <input type="password" name="confirm_password" placeholder="Confirmar contraseña" required onChange={handleChange} />
        <button type="submit">✅ Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterCliente;