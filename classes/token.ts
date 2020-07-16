import jwt from "jsonwebtoken";

export default class Token {
  private static seed: string = "secret-seed";
  private static expired: string = "30d";

  constructor() {}

  static getJwtToken(payload: any): string {
    return jwt.sign({ usuario: payload }, this.seed, {
      expiresIn: this.expired,
    });
  }

  static checkToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.seed, (err, decoded) => {
        if (err) {
          reject();
        }
        resolve(decoded);
      });
    });
  }
}
