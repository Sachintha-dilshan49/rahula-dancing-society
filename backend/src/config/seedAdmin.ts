import bcrypt from "bcrypt";
import { prisma } from "./prisma";

// Hardcoded admin — the first-login account. This is intentionally a fixed,
// well-known credential for the local/dev system (admin@gmail.com is not a real inbox).
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";

/**
 * Ensures the hardcoded admin account always exists.
 * Runs on every server startup (idempotent) — only creates the account when it
 * is missing, so a changed admin password is never overwritten.
 */
export const ensureAdmin = async () => {
  const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "ADMIN",
      name: "Administrator",
    },
  });

  console.log(`[seed] Hardcoded admin created -> ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD})`);
};
