"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2/promise"));
class CategoryModel {
    constructor() {
        this.db = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'game_db',
            charset: 'utf8',
        });
        console.log('Database connection established');
    }
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.db.execute('SELECT * FROM category');
                if (!rows) {
                    return null;
                }
                else {
                    return rows;
                }
            }
            catch (error) {
                console.error('Error fetching categories:', error);
                throw error;
            }
        });
    }
    getCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.db.execute('SELECT * FROM category WHERE id=?', [id]);
                if (!rows) {
                    return null;
                }
                else {
                    return rows[0];
                }
            }
            catch (error) {
                console.error('Error fetching category:', error);
                throw error;
            }
        });
    }
    updateCat(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.execute('UPDATE category SET name=? WHERE id=?', [name, id]);
                if (result[0].affectedRows === 1) {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (error) {
                console.error('Error updating category:', error);
                throw error;
            }
        });
    }
    insertCat(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.db.execute('INSERT INTO category(name) VALUES(?)', [nombre]);
                if (!rows) {
                    return null;
                }
                else {
                    return rows.insertId;
                }
            }
            catch (error) {
                console.error('Error inserting category:', error);
                throw error;
            }
        });
    }
    deleteCat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.execute('DELETE FROM category WHERE id=?', [id]);
                if (result[0].affectedRows === 1) {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (error) {
                console.error('Error deleting category:', error);
                throw error;
            }
        });
    }
}
exports.default = CategoryModel;
