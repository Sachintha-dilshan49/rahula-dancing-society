import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { prisma } from "./config/prisma";

async function run() {

  const hashedPassword = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      password: hashedPassword,
      role: "ADMIN"
    },
    create: {
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  console.log("User created:", user);
}

run();