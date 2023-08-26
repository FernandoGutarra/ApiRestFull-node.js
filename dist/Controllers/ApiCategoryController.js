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
const CategoryModel_1 = __importDefault(require("../Models/CategoryModel")); // Asegúrate de importar el modelo adecuado
class ApiCategoryController {
    constructor() {
        this.model = new CategoryModel_1.default();
    }
    defaultMethod(res) {
        res.status(404).json({ message: "Error: Ruta no encontrada." });
    }
    getCategories(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.model.getCategories();
                res.status(200).json(categories);
            }
            catch (error) {
                console.error("Error fetching categories:", error);
                res.status(500).json({ message: "Error al obtener las categorías" });
            }
        });
    }
    getCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID);
                const category = yield this.model.getCategory(id);
                if (category) {
                    res.status(200).json(category);
                }
                else {
                    res.status(404).json({ message: "La categoría no se encontró en la base de datos" });
                }
            }
            catch (error) {
                console.error("Error fetching category:", error);
                res.status(500).json({ message: "Error al obtener la categoría" });
            }
        });
    }
    updateCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID);
                const category = yield this.model.getCategory(id);
                if (category) {
                    const body = req.body;
                    yield this.model.updateCat(body.name, id);
                    res.status(200).json({ message: "La categoría fue actualizada correctamente" });
                }
                else {
                    res.status(404).json({ message: "No se encontró la categoría con ese ID" });
                }
            }
            catch (error) {
                console.error("Error updating category:", error);
                res.status(500).json({ message: "Error al actualizar la categoría" });
            }
        });
    }
    deleteCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.ID);
                const category = yield this.model.getCategory(id);
                if (category) {
                    yield this.model.deleteCat(id);
                    res.status(200).json({ message: "Se eliminó correctamente la categoría" });
                }
                else {
                    res.status(404).json({ message: "No se puede eliminar porque no existe la categoría" });
                }
            }
            catch (error) {
                console.error("Error deleting category:", error);
                res.status(500).json({ message: "Error al eliminar la categoría" });
            }
        });
    }
    insertCat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const id = yield this.model.insertCat(body.name);
                if (id) {
                    res.status(200).json({ message: "La categoría se insertó correctamente" });
                }
                else {
                    res.status(500).json({ message: "La categoría no se insertó correctamente" });
                }
            }
            catch (error) {
                console.error("Error inserting category:", error);
                res.status(500).json({ message: "Error al insertar la categoría" });
            }
        });
    }
}
exports.default = ApiCategoryController;
