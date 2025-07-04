const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();



const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  const {
    email,
    username,
    last_name,
    phone,
    birth_date,
    user_type,
    password,
    confirm_password,
  } = req.body;

  try {
    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.user.create({
      data: {
        email,
        username,
        last_name,
        phone,
        birth_date: birth_date ? new Date(birth_date) : null,
        user_type,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar:', error);
    return res.status(500).json({message: error.message || 'Error en el servidor' });
  }
});

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type, username: user.username },
      SECRET,
      { expiresIn: '3h' }
    );

    return res.status(200).json({
      message: 'Login exitoso',
      token,
      user_type: user.user_type,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});


module.exports = router;