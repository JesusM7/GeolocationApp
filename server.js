require('dotenv').config();
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

// --- Importa Prisma Client ---
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- Importamos los manejadores de ruta ---
const handleLoginRequest = require('./login.js');
const handleHomeRequest = require('./index.js');
const handleRegisterRequest = require('./register.js');

const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.sql': 'text/plain',
  '.prisma': 'text/plain'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`Solicitud recibida para la ruta: ${pathname}`);

  // --- Lógica para manejar las rutas de la aplicación ---
  if (pathname === '/') {
    handleLoginRequest(req, res);
    return;
  }
  
  // --- NUEVA RUTA PARA VERIFICAR CREDENCIALES ---
  if (pathname === '/login-check') {
    const { email, password } = query;

    if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Faltan campos de email o contraseña.');
        return;
    }

    try {
        // Busca el usuario en la base de datos por email
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // Si el usuario existe y la contraseña es correcta
        if (user && user.password === password) {
            console.log('Usuario autenticado con éxito:', user.email);
            // Redirige al usuario a la página de inicio
            res.writeHead(302, { 'Location': '/home' });
            res.end();
            return;
        } else {
            console.log('Credenciales incorrectas para el email:', email);
            res.writeHead(401, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>Error de Autenticación</h1>
                <p>Email o contraseña incorrectos.</p>
                <a href="/">Volver a intentar</a>
            `);
            return;
        }
    } catch (error) {
        console.error('Error al buscar el usuario en la base de datos:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Ocurrió un error en el servidor. Intente de nuevo más tarde.');
        return;
    }
  }

  // --- La ruta '/home' ya no se usa directamente en el formulario ---
  if (pathname === '/home') {
    handleHomeRequest(req, res);
    return;
  }

  // --- RUTA PARA MOSTRAR EL FORMULARIO DE REGISTRO ---
  if (pathname === '/register') {
      handleRegisterRequest(req, res);
      return;
  }

  // --- RUTA PARA PROCESAR EL REGISTRO Y GUARDAR EN LA DB ---
  if (pathname === '/register-success') {
      console.log('Formulario de registro recibido. Datos:', query);
      
      // Extrae los datos del formulario
      const { email, username, password, phone, user_type, last_name } = query;

      // Valida que los datos necesarios existan
      if (!email || !username || !password) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Error: Missing required fields (email, username, password).');
          return;
      }

      try {
          // Usa Prisma para crear un nuevo usuario en la base de datos
          const newUser = await prisma.user.create({
              data: {
                  email: email,
                  password: password, // **Aviso:** Se recomienda encarecidamente encripar la contraseña.
                  first_name: username,
                  last_name: last_name,
                  birth_date: new Date(),
                  user_type: user_type,
                  phone: phone
              }
          });
          
          console.log('Usuario creado con éxito en la base de datos:', newUser);
          
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`Registration successful for user: ${newUser.email}`);

      } catch (error) {
          console.error('Error al guardar el usuario en la base de datos:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('An error occurred during registration. The email might already be in use.');
      }
      return; 
  }

  // Lógica existente para servir archivos estáticos (CSS, etc.)
  const resolvedPath = path.join(__dirname, pathname);
  
  try {
    await fs.access(resolvedPath, fs.constants.F_OK);
    const data = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
    
  } catch (err) {
    console.error(`Archivo no encontrado: ${resolvedPath}`, err.message);
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1><hr><p>El archivo que buscas no existe.</p>');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log('Presiona CTRL + C para detener el servidor.');
});