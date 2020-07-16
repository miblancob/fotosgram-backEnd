"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../middlewares/authentication");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postsRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Obtener POST paginados
postsRoutes.get("/", [authentication_1.checkToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate("usuario", "-password")
        .exec();
    res.json({
        ok: true,
        page,
        posts,
    });
}));
// Crear POST
postsRoutes.post("/", [authentication_1.checkToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const images = fileSystem.imagesFromTempToPosts(req.usuario._id);
    body.imgs = images;
    post_model_1.Post.create(body)
        .then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate("usuario", "-password").execPopulate();
        res.json({
            ok: true,
            post: postDB,
        });
    }))
        .catch((err) => {
        res.json({
            ok: false,
            err,
        });
    });
});
// Servicio para subir archivos
postsRoutes.post("/upload", [authentication_1.checkToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "No se subió ningún archivo",
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: "No se subió ningún archivo correcto",
        });
    }
    if (!file.mimetype.includes("image")) {
        return res.status(400).json({
            ok: false,
            mensaje: "No se subió ninguna imagen",
        });
    }
    yield fileSystem.saveImageTemp(file, req.usuario._id);
    return res.json({
        ok: true,
    });
}));
postsRoutes.get("/image/:userid/:img", [authentication_1.checkToken], (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathImg = fileSystem.getImgByUrl(userId, img);
    res.sendFile(pathImg);
    // return res.json({
    //   ok: true,
    //   userId,
    //   img,
    // });
});
exports.default = postsRoutes;
