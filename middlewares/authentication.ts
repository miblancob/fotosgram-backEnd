import { Request, Response, NextFunction } from "express";
import Token from "../classes/token";

export const checkToken = (req: any, res: Response, next: NextFunction) => {
  const userToken = req.get("x-token") || "";
  Token.checkToken(userToken)
    .then((decoded: any) => {
      req.usuario = decoded.usuario;
      next();
    })
    .catch((err) => {
      res.json({
        ok: false,
        mensaje: "El token no es correcto",
      });
    });
};
