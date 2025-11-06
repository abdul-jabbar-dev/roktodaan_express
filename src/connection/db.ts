// import { PrismaClient } from "../prisma/app/generated/prisma/client";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()
prisma.$connect().then(() => {
  console.log("Connected to Prisma");
});
export default prisma
