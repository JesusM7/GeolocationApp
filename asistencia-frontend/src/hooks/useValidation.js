import { useState, useCallback } from 'react';

// Reglas de validación predefinidas
const validationRules = {
  required: (value, message = 'Este campo es obligatorio') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return null;
  },

  email: (value, message = 'Ingresa un email válido') => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (minLength) => (value, message = `Mínimo ${minLength} caracteres`) => {
    if (value && value.length < minLength) {
      return message;
    }
    return null;
  },

  maxLength: (maxLength) => (value, message = `Máximo ${maxLength} caracteres`) => {
    if (value && value.length > maxLength) {
      return message;
    }
    return null;
  },

  // Nueva validación específica para nombres
  validName: (value, message = 'Ingresa un nombre válido (solo letras, espacios y acentos)') => {
    if (!value) return null;
    
    // Permitir solo letras, espacios, acentos y algunos caracteres especiales latinos
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
    
    // Verificar que contenga solo caracteres válidos
    if (!nameRegex.test(value)) {
      return message;
    }
    
    // Verificar longitud razonable (2-30 caracteres)
    if (value.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (value.length > 30) {
      return 'El nombre no puede tener más de 30 caracteres';
    }
    
    // Verificar que no sean solo espacios o caracteres repetidos
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return 'El nombre no puede estar vacío';
    }
    
    // Verificar que no sean caracteres repetidos (más de 3 seguidos)
    if (/(.)\1{3,}/.test(value)) {
      return 'El nombre no puede tener más de 3 caracteres iguales seguidos';
    }
    
    // Verificar que no sea solo un carácter repetido
    if (/^(.)\1+$/.test(trimmed)) {
      return 'El nombre no puede ser solo un carácter repetido';
    }
    
    // Verificar patrones sospechosos (solo números, etc.)
    if (/^\d+$/.test(value)) {
      return 'El nombre no puede ser solo números';
    }
    
    return null;
  },

  // Nueva validación específica para apellidos
  validLastName: (value, message = 'Ingresa un apellido válido (solo letras, espacios y acentos)') => {
    if (!value) return null; // Apellido puede ser opcional en algunos casos
    
    // Mismas reglas que el nombre pero permitiendo estar vacío
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
    
    if (!nameRegex.test(value)) {
      return message;
    }
    
    if (value.length < 2) {
      return 'El apellido debe tener al menos 2 caracteres';
    }
    
    if (value.length > 40) {
      return 'El apellido no puede tener más de 40 caracteres';
    }
    
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return 'El apellido no puede estar vacío';
    }
    
    if (/(.)\1{3,}/.test(value)) {
      return 'El apellido no puede tener más de 3 caracteres iguales seguidos';
    }
    
    if (/^(.)\1+$/.test(trimmed)) {
      return 'El apellido no puede ser solo un carácter repetido';
    }
    
    if (/^\d+$/.test(value)) {
      return 'El apellido no puede ser solo números';
    }
    
    return null;
  },

  // Nueva validación para nombre completo del proveedor
  validProviderName: (value, message = 'Ingresa nombre y apellido válidos') => {
    if (!value) return null;
    
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
    
    if (!nameRegex.test(value)) {
      return 'Solo se permiten letras, espacios y acentos';
    }
    
    if (value.length < 3) {
      return 'Debe tener al menos 3 caracteres';
    }
    
    if (value.length > 60) {
      return 'No puede tener más de 60 caracteres';
    }
    
    const trimmed = value.trim();
    const words = trimmed.split(/\s+/).filter(word => word.length > 0);
    
    // Debe tener al menos 2 palabras (nombre y apellido)
    if (words.length < 2) {
      return 'Ingresa nombre y apellido completos';
    }
    
    // Cada palabra debe tener al menos 2 caracteres
    for (const word of words) {
      if (word.length < 2) {
        return 'Cada nombre/apellido debe tener al menos 2 caracteres';
      }
    }
    
    if (/(.)\1{3,}/.test(value)) {
      return 'No puede tener más de 3 caracteres iguales seguidos';
    }
    
    if (/^\d+$/.test(value)) {
      return 'No puede ser solo números';
    }
    
    return null;
  },

  phone: (value, message = 'Ingresa un teléfono válido (11 dígitos)') => {
    const phoneRegex = /^[0-9]{11}$/;
    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
      return message;
    }
    return null;
  },

  number: (value, message = 'Debe ser un número válido') => {
    if (value && isNaN(Number(value))) {
      return message;
    }
    return null;
  },

  positiveNumber: (value, message = 'Debe ser un número mayor a 0') => {
    if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
      return message;
    }
    return null;
  },

  password: (value, message = 'La contraseña debe tener al menos 6 caracteres') => {
    if (value && value.length < 6) {
      return message;
    }
    return null;
  },

  confirmPassword: (originalPassword) => (value, message = 'Las contraseñas no coinciden') => {
    if (value && value !== originalPassword) {
      return message;
    }
    return null;
  },

  cedula: (value, message = 'Ingresa una cédula válida (7-8 dígitos)') => {
    const cedulaRegex = /^[0-9]{7,8}$/;
    if (value && !cedulaRegex.test(value)) {
      return message;
    }
    return null;
  }
};

const useValidation = (validationSchema) => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((fieldName, value, rules) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        return error;
      }
    }
    return null;
  }, []);

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const rules = validationSchema[fieldName];
      const error = validateField(fieldName, formData[fieldName], rules);
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationSchema, validateField]);

  const validateSingleField = useCallback((fieldName, value) => {
    if (validationSchema[fieldName]) {
      const rules = validationSchema[fieldName];
      const error = validateField(fieldName, value, rules);
      
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[fieldName] = error;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });
      
      return !error;
    }
    return true;
  }, [validationSchema, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
};

export { useValidation, validationRules }; 