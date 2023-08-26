"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(body_parser_1.default.json());
// Configuración de cors
app.use((0, cors_1.default)());
// Importa y usa tus rutas
app.use(router_1.default);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
