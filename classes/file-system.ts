import { FileUpload } from "../interfaces/file-upload.interface";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystem {
  constructor() {}

  saveImageTemp(file: FileUpload, userId: string) {
    return new Promise((resolve, reject) => {
      // Crear carpetas
      const path = this.createUserFolder(userId);

      // Nombre del archivo
      const fileName = this.generateUniqueName(file.name);

      // Mover el archivo del Temp a la carpeta
      file.mv(`${path}/${fileName}`, (err: any) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  private createUserFolder(userId: string) {
    const pathUser = path.resolve(__dirname, "../uploads/", userId);
    const pathUserTemp = pathUser + "/temp";

    const exist = fs.existsSync(pathUser);
    if (!exist) {
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathUserTemp);
    }
    return pathUserTemp;
  }

  private generateUniqueName(fileName: string) {
    const nameArr = fileName.split(".");
    const extension = nameArr[nameArr.length - 1];
    const idUnique = uniqid();
    return `${idUnique}.${extension}`;
  }

  imagesFromTempToPosts(userId: string) {
    const pathTemp = path.resolve(__dirname, "../uploads/", userId, "temp");
    const pathPost = path.resolve(__dirname, "../uploads/", userId, "posts");

    if (!fs.existsSync(pathTemp)) {
      return [];
    }

    if (!fs.existsSync(pathPost)) {
      fs.mkdirSync(pathPost);
    }

    const imagesTemp = this.getImagesTemp(pathTemp);
    imagesTemp.forEach((image) => {
      fs.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
    });

    return imagesTemp;
  }

  private getImagesTemp(pathTemp: string) {
    return fs.readdirSync(pathTemp) || [];
  }

  getImgByUrl(userId: string, img: string) {
    // Path Posts
    const pathImg = path.resolve(
      __dirname,
      "../uploads/",
      userId,
      "posts",
      img
    );

    // Si la imagen no existe
    const existe = fs.existsSync(pathImg);
    if (!existe) {
      return path.resolve(__dirname, "../assets/user.png");
    }

    return pathImg;
  }
}
