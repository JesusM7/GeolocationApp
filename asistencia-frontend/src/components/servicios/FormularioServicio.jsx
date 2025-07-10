import React, { useState, useEffect } from 'react';
import { serviciosApi } from '../../services/serviciosApi';
import { useAuthContext } from '../../context/AuthContext';
import { useValidation, validationRules } from '../../hooks/useValidation';
import ErrorMessage from '../ErrorMessage';
import './FormularioServicio.css';

const FormularioServicio = ({ servicioId = null, onGuardar, onCancelar }) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    tipoServicio: 'grua',
    titulo: '',
    descripcion: '',
    precio: '',
    nombreProveedor: '',
    telefonoProveedor: '',
    emailProveedor: '',
    cedulaProveedor: '',
    latitud: '',
    longitud: '',
    direccion: '',
    ciudad: '',
    cobertura: '',
    horarioInicio: '08:00',
    horarioFin: '18:00',
    diasDisponibles: 'L,M,X,J,V'
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  // Esquema de validación
  const validationSchema = {
    titulo: [
      validationRules.required,
      validationRules.minLength(5),
      validationRules.maxLength(100)
    ],
    descripcion: [
      validationRules.required,
      validationRules.minLength(10),
      validationRules.maxLength(500)
    ],
    precio: [
      validationRules.required,
      validationRules.positiveNumber
    ],
    nombreProveedor: [
      validationRules.required,
      validationRules.validProviderName
    ],
    telefonoProveedor: [
      validationRules.required,
      validationRules.phone
    ],
    emailProveedor: [
      validationRules.required,
      validationRules.email
    ],
    cedulaProveedor: [
      validationRules.required,
      validationRules.cedula
    ],
    direccion: [
      validationRules.required,
      validationRules.minLength(5),
      validationRules.maxLength(200)
    ],
    ciudad: [
      validationRules.required,
      validationRules.minLength(2),
      validationRules.maxLength(50)
    ],
    cobertura: [
      validationRules.required,
      validationRules.positiveNumber
    ],
    latitud: [
      validationRules.required,
      validationRules.number
    ],
    longitud: [
      validationRules.required,
      validationRules.number
    ]
  };

  const { errors, validateForm, validateSingleField, clearFieldError, clearErrors } = useValidation(validationSchema);

  const diasSemana = [
    { valor: 'L', nombre: 'Lunes' },
    { valor: 'M', nombre: 'Martes' },
    { valor: 'X', nombre: 'Miércoles' },
    { valor: 'J', nombre: 'Jueves' },
    { valor: 'V', nombre: 'Viernes' },
    { valor: 'S', nombre: 'Sábado' },
    { valor: 'D', nombre: 'Domingo' }
  ];

  useEffect(() => {
    // Limpiar errores al montar el componente
    clearErrors();
    
    if (servicioId) {
      cargarServicio();
    }
  }, [servicioId, clearErrors]);

  const cargarServicio = async () => {
    try {
      setLoading(true);
      const servicio = await serviciosApi.obtenerServicioPorId(servicioId);
      setFormData({
        tipoServicio: servicio.tipoServicio,
        titulo: servicio.titulo,
        descripcion: servicio.descripcion,
        precio: servicio.precio.toString(),
        nombreProveedor: servicio.nombreProveedor,
        telefonoProveedor: servicio.telefonoProveedor,
        emailProveedor: servicio.emailProveedor,
        cedulaProveedor: servicio.cedulaProveedor,
        latitud: servicio.latitud.toString(),
        longitud: servicio.longitud.toString(),
        direccion: servicio.direccion,
        ciudad: servicio.ciudad,
        cobertura: servicio.cobertura.toString(),
        horarioInicio: servicio.horarioInicio,
        horarioFin: servicio.horarioFin,
        diasDisponibles: servicio.diasDisponibles
      });
      if (servicio.fotoUrl) {
        setImagenPreview(servicio.fotoUrl);
      }
    } catch (err) {
      setServerError('Error al cargar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    setServerError(null); // Limpiar errores del servidor
    
    // Validar campo individual
    if (validationSchema[campo]) {
      // Validar siempre, incluso si el campo está vacío
      validateSingleField(campo, valor);
    }
  };

  const handleDiaChange = (dia) => {
    const diasActuales = formData.diasDisponibles.split(',');
    const nuevoDias = diasActuales.includes(dia)
      ? diasActuales.filter(d => d !== dia)
      : [...diasActuales, dia];
    
    handleInputChange('diasDisponibles', nuevoDias.join(','));
  };

  const handleImagenChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setImagen(archivo);
      const reader = new FileReader();
      reader.onload = (e) => setImagenPreview(e.target.result);
      reader.readAsDataURL(archivo);
    }
  };

  const obtenerUbicacionActual = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const lng = position.coords.longitude.toString();
          handleInputChange('latitud', lat);
          handleInputChange('longitud', lng);
        },
        (error) => {
          alert('Error al obtener ubicación: ' + error.message);
        }
      );
    } else {
      alert('Geolocalización no soportada por este navegador');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    
    // Validar formulario completo
    if (!validateForm(formData)) {
      setServerError('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      let fotoUrl = imagenPreview;

      // Subir imagen si hay una nueva
      if (imagen) {
        const respuestaImagen = await serviciosApi.subirImagen(imagen);
        fotoUrl = respuestaImagen.url;
      }

      const servicioData = {
        ...formData,
        precio: parseFloat(formData.precio),
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        cobertura: parseInt(formData.cobertura),
        fotoUrl
      };

      let servicioGuardado;
      if (servicioId) {
        servicioGuardado = await serviciosApi.actualizarServicio(servicioId, servicioData);
      } else {
        servicioGuardado = await serviciosApi.crearServicio(servicioData);
      }

      onGuardar && onGuardar(servicioGuardado);
    } catch (err) {
      console.error('Error al guardar servicio:', err);
      
      // Manejo específico de errores mejorado
      let mensajeError = 'Error inesperado al guardar el servicio. Por favor, intenta nuevamente.';
      
      if (err.response?.data?.error) {
        // Error del backend con mensaje específico
        mensajeError = err.response.data.error;
      } else if (err.response?.data?.message) {
        // Algunos backends usan 'message' en lugar de 'error'
        mensajeError = err.response.data.message;
      } else if (err.response?.status === 400) {
        mensajeError = 'Datos inválidos. Por favor, revisa el formulario y corrige los errores.';
      } else if (err.response?.status === 401) {
        mensajeError = 'No estás autenticado. Por favor, inicia sesión nuevamente.';
      } else if (err.response?.status === 403) {
        mensajeError = '🚫 No tienes permisos para crear servicios. Solo mecánicos, conductores de grúa y administradores pueden crear servicios.';
      } else if (err.response?.status === 404) {
        mensajeError = 'Servicio no encontrado.';
      } else if (err.response?.status === 409) {
        mensajeError = 'Ya existe un servicio con estos datos. Por favor, verifica la información.';
      } else if (err.response?.status >= 500) {
        mensajeError = 'Error interno del servidor. Por favor, intenta nuevamente en unos momentos.';
      } else if (typeof err === 'string') {
        mensajeError = err;
      } else if (err.message) {
        mensajeError = err.message;
      } else if (err.error) {
        mensajeError = err.error;
      }
      
      setServerError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  if (loading && servicioId) {
    return (
      <div className="formulario-servicio-loading">
        <div className="spinner"></div>
        <p>Cargando servicio...</p>
      </div>
    );
  }

  // Verificar permisos de usuario
  if (user?.userType && !['mecanico', 'grua', 'admin'].includes(user.userType)) {
    return (
      <div className="formulario-servicio-error">
        <h2>🚫 Acceso Denegado</h2>
        <p>Solo mecánicos, conductores de grúa y administradores pueden crear servicios.</p>
        <p>Los clientes pueden ver y consumir servicios, pero no crearlos.</p>
        <p><strong>Tu rol actual:</strong> {user.userType} ({user.email})</p>
        <button onClick={onCancelar} className="btn btn-primary">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="formulario-servicio">
      <div className="formulario-header">
        <h2>{servicioId ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Tipo de Servicio */}
          <div className="form-group">
            <label htmlFor="tipoServicio">Tipo de Servicio *</label>
            <select
              id="tipoServicio"
              value={formData.tipoServicio}
              onChange={(e) => handleInputChange('tipoServicio', e.target.value)}
              disabled={loading}
            >
              <option value="grua">🚛 Grúa</option>
              <option value="mecanico">🔧 Mecánico</option>
            </select>
          </div>

          {/* Título */}
          <div className="form-group">
            <label htmlFor="titulo">Título del Servicio *</label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              placeholder="Ej: Grúa 24 Horas - Servicio Express"
              disabled={loading}
              className={errors.titulo ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.titulo} />
          </div>

          {/* Precio */}
          <div className="form-group">
            <label htmlFor="precio">Precio ($) *</label>
            <input
              type="number"
              id="precio"
              value={formData.precio}
              onChange={(e) => handleInputChange('precio', e.target.value)}
              placeholder="50"
              min="0"
              max="10000"
              disabled={loading}
              className={errors.precio ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.precio} />
          </div>

          {/* Descripción - Full Width */}
          <div className="form-group full-width">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Describe detalladamente tu servicio..."
              rows="4"
              disabled={loading}
              className={errors.descripcion ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.descripcion} />
          </div>

          {/* Información del Proveedor */}
          <div className="form-section full-width">
            <h3>Información del Proveedor</h3>
          </div>

          <div className="form-group">
            <label htmlFor="nombreProveedor">Nombre del Proveedor *</label>
            <input
              type="text"
              id="nombreProveedor"
              value={formData.nombreProveedor}
              onChange={(e) => handleInputChange('nombreProveedor', e.target.value)}
              placeholder="Nombre y apellido"
              disabled={loading}
              className={errors.nombreProveedor ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.nombreProveedor} />
          </div>

          <div className="form-group">
            <label htmlFor="cedulaProveedor">Cédula *</label>
            <input
              type="text"
              id="cedulaProveedor"
              value={formData.cedulaProveedor}
              onChange={(e) => handleInputChange('cedulaProveedor', e.target.value)}
              placeholder="12345678"
              disabled={loading}
              className={errors.cedulaProveedor ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.cedulaProveedor} />
          </div>

          <div className="form-group">
            <label htmlFor="telefonoProveedor">Teléfono *</label>
            <input
              type="tel"
              id="telefonoProveedor"
              value={formData.telefonoProveedor}
              onChange={(e) => handleInputChange('telefonoProveedor', e.target.value)}
              placeholder="04121234567"
              disabled={loading}
              className={errors.telefonoProveedor ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.telefonoProveedor} />
          </div>

          <div className="form-group">
            <label htmlFor="emailProveedor">Email *</label>
            <input
              type="email"
              id="emailProveedor"
              value={formData.emailProveedor}
              onChange={(e) => handleInputChange('emailProveedor', e.target.value)}
              placeholder="proveedor@email.com"
              disabled={loading}
              className={errors.emailProveedor ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.emailProveedor} />
          </div>

          {/* Ubicación */}
          <div className="form-section full-width">
            <h3>Ubicación del Servicio</h3>
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Dirección *</label>
            <input
              type="text"
              id="direccion"
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              placeholder="Calle 123 #45-67"
              disabled={loading}
              className={errors.direccion ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.direccion} />
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Ciudad *</label>
            <input
              type="text"
              id="ciudad"
              value={formData.ciudad}
              onChange={(e) => handleInputChange('ciudad', e.target.value)}
              placeholder="Valencia"
              disabled={loading}
              className={errors.ciudad ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.ciudad} />
          </div>

          <div className="form-group">
            <label htmlFor="cobertura">Cobertura (km) *</label>
            <input
              type="number"
              id="cobertura"
              value={formData.cobertura}
              onChange={(e) => handleInputChange('cobertura', e.target.value)}
              placeholder="10"
              min="1"
              max="100"
              disabled={loading}
              className={errors.cobertura ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.cobertura} />
          </div>

          {/* Coordenadas */}
          <div className="form-group">
            <label htmlFor="latitud">Latitud *</label>
            <input
              type="number"
              id="latitud"
              value={formData.latitud}
              onChange={(e) => handleInputChange('latitud', e.target.value)}
              placeholder="4.6097"
              step="any"
              disabled={loading}
              className={errors.latitud ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.latitud} />
          </div>

          <div className="form-group">
            <label htmlFor="longitud">Longitud *</label>
            <input
              type="number"
              id="longitud"
              value={formData.longitud}
              onChange={(e) => handleInputChange('longitud', e.target.value)}
              placeholder="-74.0817"
              step="any"
              disabled={loading}
              className={errors.longitud ? 'input-error' : ''}
            />
            <ErrorMessage error={errors.longitud} />
          </div>

          {/* Botón de geolocalización */}
          <div className="form-group">
            <button
              type="button"
              onClick={obtenerUbicacionActual}
              className="btn btn-secondary"
              disabled={loading}
            >
              📍 Obtener Ubicación Actual
            </button>
          </div>

          {/* Horarios */}
          <div className="form-section full-width">
            <h3>Horarios de Atención</h3>
          </div>

          <div className="form-group">
            <label htmlFor="horarioInicio">Hora de Inicio</label>
            <input
              type="time"
              id="horarioInicio"
              value={formData.horarioInicio}
              onChange={(e) => handleInputChange('horarioInicio', e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="horarioFin">Hora de Fin</label>
            <input
              type="time"
              id="horarioFin"
              value={formData.horarioFin}
              onChange={(e) => handleInputChange('horarioFin', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Días disponibles */}
          <div className="form-group full-width">
            <label>Días Disponibles</label>
            <div className="dias-checkboxes">
              {diasSemana.map(dia => (
                <label key={dia.valor} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.diasDisponibles.includes(dia.valor)}
                    onChange={() => handleDiaChange(dia.valor)}
                    disabled={loading}
                  />
                  {dia.nombre}
                </label>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div className="form-group full-width">
            <label htmlFor="imagen">Imagen del Servicio</label>
            <input
              type="file"
              id="imagen"
              accept="image/*"
              onChange={handleImagenChange}
              disabled={loading}
            />
            {imagenPreview && (
              <div className="imagen-preview">
                <img src={imagenPreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || Object.keys(errors).length > 0}
            title={Object.keys(errors).length > 0 ? `Hay ${Object.keys(errors).length} errores de validación` : ''}
          >
            {loading ? 'Guardando...' : (servicioId ? 'Actualizar Servicio' : 'Crear Servicio')}
          </button>
        </div>
      </form>
      {serverError && (
        <ErrorMessage error={serverError} />
      )}
    </div>
  );
};

export default FormularioServicio; 