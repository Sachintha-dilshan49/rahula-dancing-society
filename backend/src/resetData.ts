import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { prisma } from "./config/prisma";
import { ensureAdmin } from "./config/seedAdmin";

/**
 * Wipes all application data and restores a clean slate with only the
 * hardcoded admin account. Safe to run anytime (it does not touch the schema,
 * so it avoids destructive migration commands).
 *
 * Run with:  npx ts-node src/resetData.ts
 */
async function run() {
  console.log("Clearing all data...");

  // Delete in FK-safe order (children first)
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.note.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.pastPaper.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();

  // Remove uploaded files from disk
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (fs.existsSync(uploadsDir)) {
    let removed = 0;
    for (const file of fs.readdirSync(uploadsDir)) {
      try {
        fs.unlinkSync(path.join(uploadsDir, file));
        removed++;
      } catch {
        /* ignore */
      }
    }
    console.log(`Removed ${removed} uploaded file(s).`);
  }

  // Recreate the hardcoded admin
  await ensureAdmin();

  console.log("Reset complete. Only the hardcoded admin remains.");
}

run()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
