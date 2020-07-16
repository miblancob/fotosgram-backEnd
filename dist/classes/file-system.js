"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveImageTemp(file, userId) {
        return new Promise((resolve, reject) => {
            // Crear carpetas
            const path = this.createUserFolder(userId);
            // Nombre del archivo
            const fileName = this.generateUniqueName(file.name);
            // Mover el archivo del Temp a la carpeta
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    createUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, "../uploads/", userId);
        const pathUserTemp = pathUser + "/temp";
        const exist = fs_1.default.existsSync(pathUser);
        if (!exist) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    generateUniqueName(fileName) {
        const nameArr = fileName.split(".");
        const extension = nameArr[nameArr.length - 1];
        const idUnique = uniqid_1.default();
        return `${idUnique}.${extension}`;
    }
    imagesFromTempToPosts(userId) {
        const pathTemp = path_1.default.resolve(__dirname, "../uploads/", userId, "temp");
        const pathPost = path_1.default.resolve(__dirname, "../uploads/", userId, "posts");
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagesTemp = this.getImagesTemp(pathTemp);
        imagesTemp.forEach((image) => {
            fs_1.default.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
        });
        return imagesTemp;
    }
    getImagesTemp(pathTemp) {
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getImgByUrl(userId, img) {
        // Path Posts
        const pathImg = path_1.default.resolve(__dirname, "../uploads/", userId, "posts", img);
        // Si la imagen no existe
        const existe = fs_1.default.existsSync(pathImg);
        if (!existe) {
            return path_1.default.resolve(__dirname, "../assets/user.png");
        }
        return pathImg;
    }
}
exports.default = FileSystem;
