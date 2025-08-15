import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();


export const regis = async (email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: {
      email,
      password: hashed,
    },
  });
};