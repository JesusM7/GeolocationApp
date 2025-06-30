const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rutas vendrán aquí

const solicitudRoutes = require('./routes/solicitudes');
app.use('/solicitudes', solicitudRoutes);

const proveedorRoutes = require('./routes/proveedores');
app.use('/proveedores', proveedorRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});






