"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../prisma/app/generated/prisma/client");
const prisma = new client_1.PrismaClient();
prisma.$connect().then(() => {
    console.log("Connected to Prisma");
});
exports.default = prisma;
