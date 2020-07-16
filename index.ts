import Server from "./classes/server";
import usersRoutes from "./routes/usuario.route";
import postsRoutes from "./routes/post.route";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// FileUpload
server.app.use(fileUpload());

// Rutas de mi app
server.app.use("/users", usersRoutes);
server.app.use("/posts", postsRoutes);

// Conectar Base de Datos
mongoose.connect(
  "mongodb://localhost:27017/fotosgram",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("Base de Datos levantada");
  }
);

// Levantar express
server.start(() => {
  console.log(`Servidor corriendo en puerto ${server.port}`);
});
