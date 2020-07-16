"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    constructor() { }
    static getJwtToken(payload) {
        return jsonwebtoken_1.default.sign({ usuario: payload }, this.seed, {
            expiresIn: this.expired,
        });
    }
    static checkToken(token) {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                }
                resolve(decoded);
            });
        });
    }
}
exports.default = Token;
Token.seed = "secret-seed";
Token.expired = "30d";
