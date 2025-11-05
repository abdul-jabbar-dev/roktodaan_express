"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genOTP = () => Math.floor(100000 + Math.random() * 900000);
exports.default = genOTP;
