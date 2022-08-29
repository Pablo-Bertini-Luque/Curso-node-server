import express from "express";
import cors from "cors";
import { router } from "../routes/usuarios.js";
import { dbConnection } from "../database/config.js";
import { routerAuth } from "../routes/auth.js";
import { routerCategorias } from "../routes/categorias.js";
const app = express();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.middlewares();
    this.routes();
    this.paths = {
      auth: "/api/auth",
      categorias: "/api/categorias",
      usuarios: "/api/usuarios",
    };
    this.conectarDB();
  }

  //ConectarBase de datos

  async conectarDB() {
    await dbConnection();
  }

  //Middlewares
  middlewares() {
    this.app.use(express.static("public"));
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use("/api/usuarios", router);
    this.app.use("/api/auth", routerAuth);
    this.app.use("/api/categorias", routerCategorias);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto, ${this.port}`);
    });
  }
}

export { Server };
