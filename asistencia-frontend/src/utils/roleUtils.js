// Utilidades para manejo de roles de usuario

export const getRoleDisplayName = (userType) => {
  const roleNames = {
    'cliente': 'Cliente',
    'mecanico': 'Mecánico',
    'grua': 'Conductor de Grúa',
    'admin': 'Administrador',
    // Mantener compatibilidad con roles antiguos
    'customer': 'Cliente',
  };

  return roleNames[userType] || userType;
};

export const getRoleIcon = (userType) => {
  const roleIcons = {
    'cliente': '👤',
    'mecanico': '🔧',
    'grua': '🚛',
    'admin': '⚙️',
    // Mantener compatibilidad con roles antiguos
    'customer': '👤',
  };

  return roleIcons[userType] || '👤';
}; 