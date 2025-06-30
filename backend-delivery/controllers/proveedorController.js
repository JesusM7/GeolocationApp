const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//REGISTRAR PROVEEDOR

const registrarProveedor = async (req, res) => {
  const {
    nombre,
    tipo,
    latitud,
    longitud,
    radioKm
  } = req.body;

  try {
    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        nombre,
        tipo: tipo.trim().toLowerCase(),
        latitud,
        longitud,
        radioKm,
        disponible: true, // Por defecto
      },
    });

    res.status(201).json({
      mensaje: 'Proveedor registrado exitosamente',
      proveedor: nuevoProveedor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar proveedor' });
  }
};

//LISTAR PROVEEDORES

const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await prisma.proveedor.findMany();
    res.json(proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
};

module.exports = { registrarProveedor, obtenerProveedores };
