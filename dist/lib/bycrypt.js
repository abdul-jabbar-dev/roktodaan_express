"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashedPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashedPassword = (plainText) => {
    return bcryptjs_1.default.hashSync(plainText, Number(process.env.SALT) || 15);
};
exports.hashedPassword = hashedPassword;
const comparePassword = (plainText, hashedPassword) => {
    return bcryptjs_1.default.compareSync(plainText, hashedPassword);
};
exports.comparePassword = comparePassword;
