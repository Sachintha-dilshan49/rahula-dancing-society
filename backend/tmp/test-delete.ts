import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function testDelete() {
  const quizId = process.argv[2];
  if (!quizId) {
    console.error("Please provide a quiz ID to delete.");
    process.exit(1);
  }

  try {
    console.log(`Attempting to delete quiz ${quizId}...`);
    // Manually delete questions and attempts to be sure
    const questions = await (prisma as any).quizQuestion.deleteMany({
      where: { quizId },
    });
    console.log(`Deleted ${questions.count} questions.`);

    const attempts = await (prisma as any).quizAttempt.deleteMany({
      where: { quizId },
    });
    console.log(`Deleted ${attempts.count} attempts.`);

    const quiz = await (prisma as any).quiz.delete({
      where: { id: quizId },
    });
    console.log(`Deleted quiz ${quiz.id}.`);
  } catch (error) {
    console.error("Deletion failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
