import { Router, Request, Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from "bcrypt";
import Token from "../classes/token";
import { checkToken } from "../middlewares/authentication";

const usersRoutes = Router();

// Login
usersRoutes.post("/login", (req: Request, res: Response) => {
  const body = req.body;

  Usuario.findOne(
    {
      email: body.email,
    },
    (err, userDB) => {
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
        const userToken = Token.getJwtToken({
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
    }
  );
});

// Crear un usuario
usersRoutes.post("/", (req: Request, res: Response) => {
  const user = {
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar,
  };

  Usuario.create(user)
    .then((userDB) => {
      const userToken = Token.getJwtToken({
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
usersRoutes.put("/", checkToken, (req: any, res: Response) => {
  const user = {
    nombre: req.body.nombre || req.usuario.nombre,
    email: req.body.email || req.usuario.email,
    avatar: req.body.avatar || req.usuario.avatar,
  };

  Usuario.findByIdAndUpdate(
    req.usuario._id,
    user,
    { new: true },
    (err, userDB) => {
      if (err) {
        throw err;
      }
      if (!userDB) {
        return res.json({
          ok: false,
          mensaje: "No existe un usuario con ese id",
        });
      }
      const userToken = Token.getJwtToken({
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
  );
});

// Obtener el usuario
usersRoutes.get("/", [checkToken], (req: any, res: Response) => {
  const user = req.usuario;

  res.json({
    ok: true,
    user,
  });
});

export default usersRoutes;
