"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.admin = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.admin = firebase_admin_1.default;
const path_1 = __importDefault(require("path"));
const serviceAccount = path_1.default.join(__dirname, './oasisgame-ba662-firebase-adminsdk-bagmo-b47b9b57c8.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    storageBucket: 'gs://oasisgame-ba662.appspot.com'
});
const storage = firebase_admin_1.default.storage();
exports.storage = storage;
