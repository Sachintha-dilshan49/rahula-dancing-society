import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'sachintharcm@gmail.com';
  
  // Find all students linked to this user and delete them to satisfy constraints
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    await prisma.student.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { email } });
    console.log(`Deleted test user ${email} successfully!`);
  } else {
    // Delete any students with this email without a user
    await prisma.student.deleteMany({ where: { email } });
    console.log(`User ${email} not found, but cleaned up orphaned students.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
