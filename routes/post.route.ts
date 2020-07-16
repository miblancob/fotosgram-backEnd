import { Router, Request, Response } from "express";
import { checkToken } from "../middlewares/authentication";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload.interface";
import FileSystem from "../classes/file-system";

const postsRoutes = Router();
const fileSystem = new FileSystem();

// Obtener POST paginados
postsRoutes.get("/", [checkToken], async (req: any, res: Response) => {
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * 10;

  const posts = await Post.find()
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
});

// Crear POST
postsRoutes.post("/", [checkToken], (req: any, res: Response) => {
  const body = req.body;
  body.usuario = req.usuario._id;

  const images = fileSystem.imagesFromTempToPosts(req.usuario._id);
  body.imgs = images;

  Post.create(body)
    .then(async (postDB) => {
      await postDB.populate("usuario", "-password").execPopulate();

      res.json({
        ok: true,
        post: postDB,
      });
    })
    .catch((err) => {
      res.json({
        ok: false,
        err,
      });
    });
});

// Servicio para subir archivos
postsRoutes.post("/upload", [checkToken], async (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No se subió ningún archivo",
    });
  }

  const file: FileUpload = req.files.image;

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

  await fileSystem.saveImageTemp(file, req.usuario._id);

  return res.json({
    ok: true,
  });
});

postsRoutes.get(
  "/image/:userid/:img",
  [checkToken],
  (req: any, res: Response) => {
    const userId = req.params.userid;
    const img = req.params.img;

    const pathImg = fileSystem.getImgByUrl(userId, img);

    res.sendFile(pathImg);

    // return res.json({
    //   ok: true,
    //   userId,
    //   img,
    // });
  }
);

export default postsRoutes;
