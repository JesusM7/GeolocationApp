// register.js

const handleRegisterRequest = (req, res) => {
  const registerHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Register</title>
        <link rel="stylesheet" href="/style.css">
    </head>
    <body>
        <div class="login-container">
            <h2>Register</h2>
            <form action="/register-success" method="GET">
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="input-group">
                    <label for="username">Nombre de usuario</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="input-group">
                    <label for="last_name">Apellido</label>
                    <input type="text" id="last_name" name="last_name">
                </div>
                <div class="input-group">
                    <label for="phone">Teléfono</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="input-group">
                    <label for="birth_date">Fecha de Nacimiento</label>
                    <input type="date" id="birth_date" name="birth_date">
                </div>
                <div class="input-group">
                    <label for="user_type">Tipo de Usuario</label>
                    <select id="user_type" name="user_type">
                        <option value="customer">Cliente</option>
                        <option value="company">Compañia</option>
                        <option value="mechanic">Mecanico</option>
                        <option value="tow_truck">Conductor de Grua</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="input-group">
                    <label for="confirm-password">Confirmar Contraseña</label>
                    <input type="password" id="confirm-password" name="confirm-password" required>
                </div>
                <button type="submit">Crear Cuenta</button>
            </form>
            <p class="register-link">¿Ya tienes una cuenta? <a href="/">Iniciar sesión</a></p>
        </div>
    </body>
    </html>
  `;

  console.log('Serving the registration form.');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(registerHtml);
};

module.exports = handleRegisterRequest;