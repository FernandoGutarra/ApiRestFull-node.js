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
class UserModel {
    constructor() {
        this.db = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'game_db',
            charset: 'utf8',
        });
    }
    getUserForGmail(gmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [row] = yield this.db.execute('SELECT * FROM usuarios WHERE gmail=?', [gmail]);
                if (!row[0]) { //A UN QUE ME VENGA UN ARRAY Y YO SEPA QUE ME VA AVENIR UN SOLO OBJETO TENGO QUE PONER [0]
                    return null;
                }
                else {
                    const user = row[0];
                    return user;
                }
            }
            catch (error) {
                console.error('Error fetching user by gmail:', error);
                throw error;
            }
        });
    }
    deleteUserForGmail(gmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.execute('DELETE FROM usuarios WHERE gmail=?', [gmail]);
                if (result[0].affectedRows === 1) {
                    console.log('User deleted successfully.');
                }
                else {
                    console.log('User not found or not deleted.');
                }
            }
            catch (error) {
                console.error('Error deleting user by gmail:', error);
                throw new Error('Error deleting user.');
            }
        });
    }
    updateUserForGmail(id, nombre, gmail, contraseña, rol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.db.execute('UPDATE usuarios SET name=?, email=?, password=?, rol=? WHERE id=?', [nombre, gmail, contraseña, rol, id]);
                if (result[0].affectedRows === 1) {
                    console.log('User updated successfully.');
                }
                else {
                    console.log('User not found or not updated.');
                }
            }
            catch (error) {
                console.error('Error updating user by gmail:', error);
                throw error;
            }
        });
    }
    insertUser(name, gmail, password, rol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield this.db.execute('INSERT INTO usuarios(name, gmail, password, rol) VALUES(?, ?, ?, ?)', [name, gmail, password, rol]);
                return result.insertId;
            }
            catch (error) {
                console.error('Error inserting user:', error);
                throw error;
            }
        });
    }
}
exports.default = UserModel;
