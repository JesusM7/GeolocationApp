import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useValidation, validationRules } from '../../hooks/useValidation';
import ErrorMessage from '../../components/ErrorMessage';
import './LoginCliente.css';
import API from '../../services/api';
import { ENDPOINTS } from '../../config/api.config.js';

function LoginCliente() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthContext();

  // Esquema de validación
  const validationSchema = {
    email: [
      validationRules.required,
      validationRules.email
    ],
    password: [
      validationRules.required,
      validationRules.minLength(6)
    ]
  };

  const { errors, validateForm, validateSingleField, clearFieldError } = useValidation(validationSchema);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setServerError(''); // Limpiar errores del servidor
    
    // Validar campo individual cuando el usuario deja de escribir
    if (value.trim()) {
      validateSingleField(field, value);
    } else {
      clearFieldError(field);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validar formulario completo
    if (!validateForm(formData)) {
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(ENDPOINTS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
      });

      const { token, user_type } = res.data;

      // Usar el hook de autenticación para manejar el login
      const loginSuccess = login(token, { user_type });

      if (loginSuccess) {
        // Redirigir según el tipo de usuario
        if (user_type === 'admin') {
          navigate('/admin');
        } else {
          navigate('/cliente/home');
        }
      } else {
        setServerError('Error al procesar la autenticación');
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-cliente">
      <h2>🔐 Iniciar sesión</h2>
      
      {serverError && (
        <ErrorMessage error={serverError} />
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={loading}
            className={errors.email ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.email} />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            disabled={loading}
            className={errors.password ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.password} />
        </div>

        <button type="submit" disabled={loading || Object.keys(errors).length > 0}>
          {loading ? 'Iniciando sesión...' : 'Ingresar'}
        </button>
      </form>
      
      <div className="login-extra">
        <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
      </div>
    </div>
  );
}

export default LoginCliente;
