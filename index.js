// index.js

const url = require('url');

const handleHomeRequest = (req, res) => {
    // Analiza la URL para obtener los parámetros de la consulta (los datos del formulario)
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    console.log('Recibida una solicitud para la página de inicio.');
    console.log('Datos del formulario:', query);

    // Muestra un mensaje de bienvenida que puede incluir los datos del formulario
    const welcomeMessage = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Bienvenido</title>
            <link rel="stylesheet" href="/style.css">
            <style>
                /* Estilos específicos para esta página */
                .welcome-container {
                    text-align: center;
                    padding: 50px;
                    font-size: 24px;
                    color: #007bff;
                }
            </style>
        </head>
        <body>
            <div class="login-container">
                <div class="welcome-container">
                    <h1>Hola Mundo!</h1>
                    <p>¡Login exitoso para el email: <strong>${query.email}</strong>!</p>
                </div>
            </div>
        </body>
        </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(welcomeMessage);
};

module.exports = handleHomeRequest;