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
class GameModel {
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
    getGames() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield this.db.execute('SELECT * FROM juegos');
                if (!rows) {
                    return null;
                }
                else {
                    return rows;
                }
            }
            catch (error) {
                console.error('Error fetching games:', error);
                throw error;
            }
        });
    }
    getGame(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [row] = yield this.db.execute('SELECT * FROM juegos WHERE id=?', [id]);
                if (!row[0]) {
                    return null;
                }
                else {
                    return row[0];
                }
            }
            catch (error) {
                console.error('Error fetching game:', error);
                throw error;
            }
        });
    }
    insertGame(name, releaseDate, description, price, mainImage, downloadLink, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield this.db.execute('INSERT INTO juegos(name, releaseDate, description, price, mainImage, downloadLink, fk_id_category) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, releaseDate, description, price, mainImage, downloadLink, category]);
                return result.insertId;
            }
            catch (error) {
                console.error('Error inserting game:', error);
                throw error;
            }
        });
    }
    updateGame(id, name, releaseDate, description, price, mainImage, downloadLink, category) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.execute('UPDATE juegos SET name=?, release_date=?, description=?, price=?, main_image=?, download_link=?, fk_id_category=? WHERE id=?', [name, releaseDate, description, price, mainImage, downloadLink, category, id]);
                if (result[0].affectedRows === 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error('Error updating game:', error);
                throw error;
            }
        });
    }
    deleteGame(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.execute('DELETE FROM juegos WHERE id=?', [id]);
                if (result[0].affectedRows === 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error('Error deleting game:', error);
                throw error;
            }
        });
    }
}
exports.default = GameModel;
