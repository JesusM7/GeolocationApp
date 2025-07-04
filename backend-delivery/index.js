const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

const authRoutes = require('./routes/auth.routes');


app.use(cors());
app.use(express.json());



// Rutas vendrán aquí

app.use('/api', authRoutes); // 🔗 Aquí conectas la ruta


const solicitudRoutes = require('./routes/solicitudes');
app.use('/solicitudes', solicitudRoutes);

const proveedorRoutes = require('./routes/proveedores');
app.use('/proveedores', proveedorRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});






