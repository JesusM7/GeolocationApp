// login.js

const handleLoginRequest = (req, res) => {
  const loginHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="login-container">
            <h2>Iniciar Sesión</h2>
            <form action="/login-check" method="GET"> <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="input-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit">Entrar</button>
            </form>
            <p class="register-link">¿No tienes cuenta? <a href="/register">Crea una</a></p>
        </div>
    </body>
    </html>
  `;

  console.log('Sirviendo la página de login.');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(loginHtml);
};

module.exports = handleLoginRequest;