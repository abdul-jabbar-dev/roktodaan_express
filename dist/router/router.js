"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ROUTER = express_1.default.Router();
ROUTER.get("/user", (req, res) => {
    res.send("heeelo    ");
});
exports.default = ROUTER;
