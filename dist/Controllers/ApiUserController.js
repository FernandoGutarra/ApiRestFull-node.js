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
const UserModel_1 = __importDefault(require("../Models/UserModel")); // Asegúrate de importar el modelo adecuado
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ApiUserController {
    constructor() {
        this.model = new UserModel_1.default();
    }
    defaultMethod(res) {
        res.status(404).json({ message: "Error: Ruta no encontrada." });
    }
    verifyRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body) {
                try {
                    const body = req.body;
                    const newPassword = body.password;
                    const hashedPassword = yield this.hashPassword(newPassword);
                    if (hashedPassword) {
                        const lastInsertId = yield this.model.insertUser(body.name, body.gmail, hashedPassword, body.rol);
                        if (lastInsertId) {
                            res
                                .status(200)
                                .json({ message: "El Usuario Se Registró Correctamente" });
                        }
                        else {
                            res.status(500).json({ message: "No se pudo lograr Registrar" });
                        }
                    }
                }
                catch (error) {
                    console.error("Error al crear usuario:", error);
                    res.status(500).json({ message: "Hubo un error al crear el usuario" });
                }
            }
        });
    }
    verifyLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                console.log(body);
                if (body) {
                    const gmail = body.email;
                    const password = body.password;
                    const user = yield this.model.getUserForGmail(gmail);
                    if (user && (yield this.verifyPassword(password, user.password))) {
                        const token = jsonwebtoken_1.default.sign({ user }, "tu_secreto_secreto", {
                            expiresIn: "1h",
                        });
                        res.status(200).json({ token, user });
                    }
                    else {
                        res.status(401).json({ message: "Usuario o contraseña incorrectos" });
                    }
                }
                else {
                    res
                        .status(400)
                        .json({ message: "Datos de inicio de sesión no proporcionados" });
                }
            }
            catch (error) {
                console.error("Error verifying login:", error);
                res
                    .status(500)
                    .json({ message: "Error al verificar el inicio de sesión" });
            }
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            return bcrypt_1.default.hash(password, saltRounds);
        });
    }
    verifyPassword(enteredPassword, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt_1.default.compare(enteredPassword, hashedPassword);
        });
    }
    logout(req, res) {
        res.status(200).json({ message: "Cierre de sesión exitoso" });
    }
}
exports.default = ApiUserController;
