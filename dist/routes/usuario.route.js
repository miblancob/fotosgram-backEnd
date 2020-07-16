"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const authentication_1 = require("../middlewares/authentication");
const usersRoutes = express_1.Router();
// Login
usersRoutes.post("/login", (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({
        email: body.email,
    }, (err, userDB) => {
        if (err) {
            throw err;
        }
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "El usuario/contraseña no es correcto",
            });
        }
        if (userDB.checkPassword(body.password)) {
            const userToken = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar,
            });
            return res.json({
                ok: true,
                token: userToken,
            });
        }
        return res.json({
            ok: false,
            mensaje: "El usuario/contraseña no es correcto",
        });
    });
});
// Crear un usuario
usersRoutes.post("/", (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
    };
    usuario_model_1.Usuario.create(user)
        .then((userDB) => {
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        res.json({
            ok: true,
            token: userToken,
        });
    })
        .catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});
// Actualizar usuario
usersRoutes.put("/", authentication_1.checkToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar,
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err) {
            throw err;
        }
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: "No existe un usuario con ese id",
            });
        }
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar,
        });
        return res.json({
            ok: true,
            token: userToken,
        });
    });
});
// Obtener el usuario
usersRoutes.get("/", [authentication_1.checkToken], (req, res) => {
    const user = req.usuario;
    res.json({
        ok: true,
        user,
    });
});
exports.default = usersRoutes;
