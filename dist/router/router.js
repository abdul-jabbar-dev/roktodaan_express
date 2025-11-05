"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = __importDefault(require("../app/user/user.router"));
const media_route_1 = __importDefault(require("../app/media/media.route"));
const ROUTER = express_1.default.Router();
ROUTER.use("/user", user_router_1.default);
ROUTER.use("/media", media_route_1.default);
exports.default = ROUTER;
