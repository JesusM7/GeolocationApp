import { useState } from 'react';
import { useValidation, validationRules } from '../hooks/useValidation';
import ErrorMessage from './ErrorMessage';
import API from '../services/api';

const ProveedorForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    latitud: '',
    longitud: '',
    radioKm: ''
  });
  const [loading, setLoading] = useState(false);

  // Esquema de validación
  const validationSchema = {
    nombre: [
      validationRules.required,
      validationRules.validProviderName
    ],
    tipo: [
      validationRules.required,
      validationRules.minLength(2),
      validationRules.maxLength(20)
    ],
    latitud: [
      validationRules.required,
      validationRules.number
    ],
    longitud: [
      validationRules.required,
      validationRules.number
    ],
    radioKm: [
      validationRules.required,
      validationRules.positiveNumber
    ]
  };

  const { errors, validateForm, validateSingleField, clearFieldError } = useValidation(validationSchema);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Validar campo individual
    if (value.trim()) {
      validateSingleField(name, value);
    } else {
      clearFieldError(name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario completo
    if (!validateForm(form)) {
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/proveedores/registrar', {
        nombre: form.nombre.trim(),
        tipo: form.tipo.trim().toLowerCase(),
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        radioKm: parseFloat(form.radioKm)
      });

      alert(`✅ Proveedor registrado: ${response.data.proveedor.nombre}`);
      
      // Limpiar formulario
      setForm({
        nombre: '',
        tipo: '',
        latitud: '',
        longitud: '',
        radioKm: ''
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'Error al registrar proveedor';
      alert(`⚠️ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h2>Registrar proveedor</h2>
      
      <div>
        <input 
          name="nombre" 
          placeholder="Nombre y apellido del proveedor" 
          value={form.nombre}
          onChange={handleChange}
          disabled={loading}
          className={errors.nombre ? 'input-error' : ''}
          style={{ 
            padding: '0.75rem', 
            border: errors.nombre ? '1px solid #f44336' : '1px solid #ddd',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <ErrorMessage error={errors.nombre} />
      </div>

      <div>
        <input 
          name="tipo" 
          placeholder="Tipo (grua, mecanico)" 
          value={form.tipo}
          onChange={handleChange}
          disabled={loading}
          className={errors.tipo ? 'input-error' : ''}
          style={{ 
            padding: '0.75rem', 
            border: errors.tipo ? '1px solid #f44336' : '1px solid #ddd',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <ErrorMessage error={errors.tipo} />
      </div>

      <div>
        <input 
          name="latitud" 
          type="number"
          step="any"
          placeholder="Latitud (ej: 10.162190)" 
          value={form.latitud}
          onChange={handleChange}
          disabled={loading}
          className={errors.latitud ? 'input-error' : ''}
          style={{ 
            padding: '0.75rem', 
            border: errors.latitud ? '1px solid #f44336' : '1px solid #ddd',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <ErrorMessage error={errors.latitud} />
      </div>

      <div>
        <input 
          name="longitud" 
          type="number"
          step="any"
          placeholder="Longitud (ej: -67.344280)" 
          value={form.longitud}
          onChange={handleChange}
          disabled={loading}
          className={errors.longitud ? 'input-error' : ''}
          style={{ 
            padding: '0.75rem', 
            border: errors.longitud ? '1px solid #f44336' : '1px solid #ddd',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <ErrorMessage error={errors.longitud} />
      </div>

      <div>
        <input 
          name="radioKm" 
          type="number"
          min="1"
          max="100"
          placeholder="Radio en kilómetros (ej: 10)" 
          value={form.radioKm}
          onChange={handleChange}
          disabled={loading}
          className={errors.radioKm ? 'input-error' : ''}
          style={{ 
            padding: '0.75rem', 
            border: errors.radioKm ? '1px solid #f44336' : '1px solid #ddd',
            borderRadius: '4px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
        <ErrorMessage error={errors.radioKm} />
      </div>

      <button 
        type="submit"
        disabled={loading || Object.keys(errors).length > 0}
        style={{
          padding: '0.75rem',
          backgroundColor: loading || Object.keys(errors).length > 0 ? '#ccc' : '#D32F2F',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading || Object.keys(errors).length > 0 ? 'not-allowed' : 'pointer',
          fontSize: '1rem'
        }}
      >
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
};

export default ProveedorForm;