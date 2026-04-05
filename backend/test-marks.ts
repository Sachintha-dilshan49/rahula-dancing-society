import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findFirst();
  if (!student) {
    console.log("No student to add marks to.");
    return;
  }
  console.log(`Adding mark to student ${student.name}`);

  // Test upsert
  const res = await prisma.mark.upsert({
    where: {
      studentId_grade_term: {
        studentId: student.id,
        grade: 11,
        term: 1
      }
    },
    update: { practicalMark: 85, paperMark: 90 },
    create: { studentId: student.id, grade: 11, term: 1, practicalMark: 85, paperMark: 90 }
  });
  console.log("Upsert response:", res);

  // Test retrieval
  const marks = await prisma.mark.findMany({ where: { studentId: student.id } });
  console.log("Student marks:", marks);
}

main().finally(() => prisma.$disconnect());
