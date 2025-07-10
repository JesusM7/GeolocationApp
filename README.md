# AsisCar - Sistema de Asistencia Vehicular

Sistema web para conectar usuarios que necesitan servicios de asistencia vehicular (grúa, mecánico) con proveedores de servicios cercanos.

## 🚀 Tecnologías Utilizadas

### Frontend
- **React** 19.1.0 con Vite
- **React Router Dom** para navegación
- **Axios** para peticiones HTTP
- **JWT Decode** para manejo de tokens

### Backend
- **Node.js** con Express
- **Prisma** ORM para base de datos
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **Bcrypt** para encriptación de contraseñas

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [PostgreSQL](https://www.postgresql.org/) (versión 12 o superior)
- [Git](https://git-scm.com/)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/JesusM7/GeolocationApp.git
cd AsisCar
```

### 2. Configurar la Base de Datos

#### Instalar PostgreSQL
1. Descargar e instalar PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/)
2. Durante la instalación, recordar la contraseña del usuario `postgres`

#### Crear la base de datos
```sql
-- Conectarse a PostgreSQL como usuario postgres
psql -U postgres

-- Crear la base de datos
CREATE DATABASE geolocation;

-- Salir de psql
\q
```

### 3. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend-delivery

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

#### Editar el archivo `.env` del backend:
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/geolocation"
```

**Importante:** Reemplaza `TU_CONTRASEÑA` con la contraseña que configuraste para el usuario `postgres`.

#### Configurar Prisma y la base de datos:
```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar las migraciones (crear las tablas)
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio para ver la base de datos
npx prisma studio
```

### 4. Configurar el Frontend

```bash
# Navegar al directorio del frontend (desde la raíz del proyecto)
cd asistencia-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

#### Editar el archivo `.env` del frontend:
```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Ejecutar el Proyecto

### Opción 1: Ejecutar ambos servicios por separado

#### Terminal 1 - Backend:
```bash
cd backend-delivery
npm run dev
```
El backend estará disponible en: `http://localhost:3000`

#### Terminal 2 - Frontend:
```bash
cd asistencia-frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

### Opción 2: Ejecutar desde la raíz (si tienes scripts configurados)

```bash
# Desde la raíz del proyecto
npm run dev:backend &
npm run dev:frontend
```

## 📊 Estructura del Proyecto

```
AsisCar/
├── backend-delivery/           # API Backend
│   ├── controllers/           # Controladores
│   ├── middleware/           # Middlewares
│   ├── routes/              # Rutas de la API
│   ├── prisma/              # Configuración de base de datos
│   ├── uploads/             # Archivos subidos
│   ├── utils/               # Utilidades
│   ├── package.json
│   └── .env
├── asistencia-frontend/        # Aplicación React
│   ├── src/                 # Código fuente
│   ├── public/              # Archivos públicos
│   ├── package.json
│   └── .env
└── README.md
```

## 🔑 Funcionalidades Principales

- **Registro y autenticación** de usuarios
- **Geolocalización** para encontrar servicios cercanos
- **Gestión de servicios** (grúa, mecánico, repuestos)
- **Sistema de solicitudes** de asistencia
- **Panel de proveedores** para gestionar servicios

## 🛠️ Comandos Útiles

### Backend
```bash
# Desarrollo
npm run dev

# Ver base de datos
npx prisma studio

# Resetear base de datos
npx prisma migrate reset

# Generar cliente Prisma
npx prisma generate
```

### Frontend
```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de producción
npm run preview

# Linting
npm run lint
```

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verificar que PostgreSQL esté ejecutándose
- Revisar la URL de conexión en el archivo `.env`
- Asegurarse de que la base de datos `geolocation` exista

### Error de puerto en uso
- Cambiar el puerto en el backend (archivo `index.js`)
- Verificar que no haya otros servicios usando los puertos 3000 y 5173

### Error de módulos no encontrados
```bash
# Limpiar caché e reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```