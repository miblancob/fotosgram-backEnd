"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_route_1 = __importDefault(require("./routes/usuario.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use(express_fileupload_1.default());
// Configurar CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// Rutas de mi app
server.app.use("/users", usuario_route_1.default);
server.app.use("/posts", post_route_1.default);
// Conectar Base de Datos
mongoose_1.default.connect("mongodb://localhost:27017/fotosgram", {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (err) {
        throw err;
    }
    console.log("Base de Datos levantada");
});
// Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
