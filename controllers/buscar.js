import mongoose from "mongoose";
import Categoria from "../models/categoria.js";
import Usuario from "../models/usuario.js";
import Producto from "../models/producto.js";

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "role"];

const buscarUsuarios = async (termino = "", res) => {
  const esMongID = mongoose.isValidObjectId(termino);
  if (esMongID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = "", res) => {
  const esMongID = mongoose.isValidObjectId(termino);
  if (esMongID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const categorias = await Categoria.find({ nombre: regex, estado: true });
  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = "", res) => {
  const esMongID = mongoose.isValidObjectId(termino);
  if (esMongID) {
    const producto = await Producto.findById(termino)
      .populate("categoria", "nombre")
      .populate("usuario", "nombre");
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  const regex = new RegExp(termino, "i");
  const productos = await Producto.find({
    nombre: regex,
    estado: true,
  })
    .populate("categoria", "nombre")
    .populate("usuario", "nombre");
  res.json({
    results: productos,
  });
};

const buscar = (req, res) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se me olvidó hacer esta búsqueda",
      });
  }
};

export { buscar };
