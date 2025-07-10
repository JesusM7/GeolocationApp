import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useValidation, validationRules } from '../../hooks/useValidation';
import ErrorMessage from '../../components/ErrorMessage';
import './RegisterCliente.css';
import axios from 'axios';

function RegisterCliente() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    last_name: '',
    phone: '',
    birth_date: '',
    user_type: 'cliente',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  // Esquema de validación
  const validationSchema = {
    email: [
      validationRules.required,
      validationRules.email
    ],
    username: [
      validationRules.required,
      validationRules.validName
    ],
    last_name: [
      validationRules.validLastName
    ],
    phone: [
      validationRules.required,
      validationRules.phone
    ],
    password: [
      validationRules.required,
      validationRules.password
    ],
    confirm_password: [
      validationRules.required,
      validationRules.confirmPassword(formData.password)
    ]
  };

  const { errors, validateForm, validateSingleField, clearFieldError } = useValidation(validationSchema);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setServerError(''); // Limpiar errores del servidor
    
    // Validar campo individual
    if (value.trim() || name === 'confirm_password') {
      // Para confirm_password, necesitamos revalidar cuando cambia la contraseña
      if (name === 'password' && formData.confirm_password) {
        validateSingleField('confirm_password', formData.confirm_password);
      }
      validateSingleField(name, value);
    } else {
      clearFieldError(name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validar formulario completo
    if (!validateForm(formData)) {
      return;
    }

    // Validación adicional de contraseñas
    if (formData.password !== formData.confirm_password) {
      setServerError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, formData);

      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Error en el registro';
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-cliente">
      <h2>🧾 Crear cuenta</h2>
      
      {serverError && (
        <ErrorMessage error={serverError} />
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="email" 
            name="email" 
            placeholder="Correo electrónico" 
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className={errors.email ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.email} />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="username" 
            placeholder="Nombre" 
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            className={errors.username ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.username} />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="last_name" 
            placeholder="Apellido" 
            value={formData.last_name}
            onChange={handleChange}
            disabled={loading}
            className={errors.last_name ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.last_name} />
        </div>

        <div className="form-group">
          <input 
            type="tel" 
            name="phone" 
            placeholder="Teléfono" 
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            className={errors.phone ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.phone} />
        </div>

        <div className="form-group">
          <input 
            type="date" 
            name="birth_date" 
            value={formData.birth_date}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <select 
            name="user_type" 
            value={formData.user_type}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="cliente">Cliente</option>
            <option value="mecanico">Mecánico</option>
            <option value="grua">Conductor de Grúa</option>
          </select>
        </div>

        <div className="form-group">
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña (mínimo 6 caracteres)" 
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className={errors.password ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.password} />
        </div>

        <div className="form-group">
          <input 
            type="password" 
            name="confirm_password" 
            placeholder="Confirmar contraseña" 
            value={formData.confirm_password}
            onChange={handleChange}
            disabled={loading}
            className={errors.confirm_password ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.confirm_password} />
        </div>

        <button 
          type="submit" 
          disabled={loading || Object.keys(errors).length > 0}
        >
          {loading ? 'Registrando...' : '✅ Registrarse'}
        </button>
      </form>

      <div className="register-extra">
        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
      </div>
    </div>
  );
}

export default RegisterCliente;