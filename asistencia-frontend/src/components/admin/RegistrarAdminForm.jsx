import { useState } from 'react';
import { useValidation, validationRules } from '../../hooks/useValidation';
import ErrorMessage from '../ErrorMessage';
import { adminApi } from '../../services/adminApi';
import './RegistrarAdminForm.css';

const RegistrarAdminForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    last_name: '',
    phone: '',
    birth_date: '',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

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
    setServerError('');
    
    // Validar campo individual
    if (value.trim() || name === 'confirm_password') {
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
      const result = await adminApi.registrarAdministrador(formData);
      
      // Limpiar formulario
      setFormData({
        email: '',
        username: '',
        last_name: '',
        phone: '',
        birth_date: '',
        password: '',
        confirm_password: '',
      });

      onSuccess && onSuccess(result);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Error al registrar administrador';
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registrar-admin-form">
      <div className="form-header">
        <h3>🔐 Registrar Nuevo Administrador</h3>
        <p>Solo los administradores pueden crear otros administradores</p>
      </div>
      
      {serverError && (
        <ErrorMessage error={serverError} />
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico *</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            placeholder="admin@empresa.com" 
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className={errors.email ? 'input-error' : ''}
          />
          <ErrorMessage error={errors.email} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Nombre *</label>
            <input 
              type="text" 
              id="username"
              name="username" 
              placeholder="Juan" 
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              className={errors.username ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.username} />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Apellido</label>
            <input 
              type="text" 
              id="last_name"
              name="last_name" 
              placeholder="Pérez" 
              value={formData.last_name}
              onChange={handleChange}
              disabled={loading}
              className={errors.last_name ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.last_name} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Teléfono *</label>
            <input 
              type="tel" 
              id="phone"
              name="phone" 
              placeholder="04121234567" 
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              className={errors.phone ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.phone} />
          </div>

          <div className="form-group">
            <label htmlFor="birth_date">Fecha de nacimiento</label>
            <input 
              type="date" 
              id="birth_date"
              name="birth_date" 
              value={formData.birth_date}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              placeholder="Mínimo 6 caracteres" 
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={errors.password ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.password} />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Confirmar contraseña *</label>
            <input 
              type="password" 
              id="confirm_password"
              name="confirm_password" 
              placeholder="Repetir contraseña" 
              value={formData.confirm_password}
              onChange={handleChange}
              disabled={loading}
              className={errors.confirm_password ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.confirm_password} />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? 'Registrando...' : 'Registrar Administrador'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarAdminForm; 