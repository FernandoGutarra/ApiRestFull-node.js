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
const firebaseConfig_1 = require("../firebaseConfig");
const stream_1 = require("stream");
const uuid_1 = require("uuid");
const GameModel_1 = __importDefault(require("../Models/GameModel"));
class ApiGameController {
    constructor() {
        this.model = new GameModel_1.default();
    }
    defaultMethod(res) {
        this.sendResponse(res, 404, { message: "Error: Ruta no encontrada." });
    }
    getGames(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const games = yield this.model.getGames();
                if (games) {
                    this.sendResponse(res, 200, games);
                }
                else {
                    this.sendResponse(res, 404, { message: "No se encontraron juegos" });
                }
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al obtener los juegos" });
            }
        });
    }
    getGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID); // Convertir el parámetro a número
                if (isNaN(id)) {
                    this.sendResponse(res, 400, { message: "El ID del juego no es válido" });
                    return;
                }
                const game = yield this.model.getGame(id);
                if (game) {
                    this.sendResponse(res, 200, game);
                }
                else {
                    this.sendResponse(res, 404, { message: "El juego no existe" });
                }
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al obtener el juego" });
            }
        });
    }
    deleteGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID);
                const game = yield this.model.getGame(id);
                if (game) {
                    const imageUrl = game.mainImage;
                    if (imageUrl) {
                        yield this.deleteImageFromFirebaseStorage(imageUrl);
                    }
                    yield this.model.deleteGame(id);
                    this.sendResponse(res, 200, { message: "El juego se eliminó" });
                }
                else {
                    this.sendResponse(res, 404, { message: "El juego no se eliminó porque no existe en la base de datos" });
                }
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al eliminar el juego" });
            }
        });
    }
    updateGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID);
                const body = req.body;
                const mainImage = body.mainImage;
                const game = yield this.model.getGame(id);
                if (game) {
                    const imageUrl = game.mainImage;
                    yield this.deleteImageFromFirebaseStorage(imageUrl);
                }
                if (game) {
                    const token = yield this.uploadImageToFirebaseStorage(mainImage);
                    yield this.model.updateGame(id, body.name, body.releaseDate, body.description, body.price, token, body.downloadLink, body.category);
                    this.sendResponse(res, 200, { message: "El juego se actualizó correctamente" });
                }
                else {
                    this.sendResponse(res, 404, { message: "El juego no se pudo actualizar correctamente" });
                }
            }
            catch (error) {
                console.error("Error updating game:", error);
                this.sendResponse(res, 500, { message: "Error al actualizar el juego" });
            }
        });
    }
    insertGame(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const mainImage = req.file;
                const token = yield this.uploadImageToFirebaseStorage(mainImage);
                if (token) {
                    const id = yield this.model.insertGame(body.name, body.releaseDate, body.description, body.price, token, body.downloadLink, body.category);
                    if (id) {
                        this.sendResponse(res, 201, "El juego se insertó correctamente");
                    }
                    else {
                        this.sendResponse(res, 500, "No se pudo insertar el juego en la base de datos");
                    }
                }
            }
            catch (error) {
                this.sendResponse(res, 500, { message: "Error al insertar el juego" });
            }
        });
    }
    sendResponse(res, status, payload) {
        res.status(status).json(payload);
    }
    getBody(req) {
        return req.body;
    }
    deleteImageFromFirebaseStorage(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
                const bucket = firebaseConfig_1.admin.storage().bucket();
                const file = bucket.file(fileName);
                yield file.delete();
            }
            catch (error) {
                throw new Error("Error al eliminar la imagen de Firebase Storage");
            }
        });
    }
    uploadImageToFirebaseStorage(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file.buffer || file.buffer.length === 0) {
                throw new Error("El buffer de la imagen está vacío o no existe.");
            }
            const bucket = firebaseConfig_1.admin.storage().bucket();
            const uniqueFileName = `${(0, uuid_1.v4)()}_${file.originalname}`;
            const fileUpload = bucket.file(uniqueFileName);
            const bufferStream = new stream_1.Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);
            const token = (0, uuid_1.v4)(); // Generar un nuevo token de acceso
            const metadata = {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: token,
                },
            };
            const options = {
                destination: fileUpload,
                public: true,
                resumable: false,
                metadata: metadata,
            };
            return new Promise((resolve, reject) => {
                fileUpload.createWriteStream(options)
                    .on('error', (error) => {
                    console.error("Error al cargar la imagen:", error);
                    reject(error);
                })
                    .on('finish', () => {
                    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
                    resolve(imageUrl);
                })
                    .end(file.buffer);
            });
        });
    }
}
exports.default = ApiGameController;
