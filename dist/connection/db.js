"use strict";
// import { PrismaClient } from "../prisma/app/generated/prisma/client";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
prisma.$connect().then(() => {
    console.log("Connected to Prisma");
});
exports.default = prisma;
