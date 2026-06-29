import { prisma } from "../config/prisma";

export const getStudentsWithMarks = async (grade: number, term: number) => {
  return prisma.student.findMany({
    where: { grade },
    include: {
      marks: {
        // Filter by grade as well as term — otherwise a promoted student's
        // same-term mark from a previous grade would leak into this view.
        where: { grade, term }
      }
    },
    orderBy: { name: "asc" }
  });
};

export const getStudentMarks = async (studentId: string) => {
  return prisma.mark.findMany({
    where: { studentId },
    orderBy: [{ grade: "asc" }, { term: "asc" }]
  });
};

interface MarkUpsertInput {
  studentId: string;
  grade: number;
  term: number;
  practicalMark: number | null;
  paperMark: number | null;
}

export const bulkUpsertMarks = async (grade: number, term: number, marksData: MarkUpsertInput[]) => {
  const operations = marksData.map((data) => {
    return prisma.mark.upsert({
      where: {
        studentId_grade_term: {
          studentId: data.studentId,
          grade: data.grade,
          term: data.term
        }
      },
      update: {
        practicalMark: data.practicalMark,
        paperMark: data.paperMark
      },
      create: {
        studentId: data.studentId,
        grade: data.grade,
        term: data.term,
        practicalMark: data.practicalMark,
        paperMark: data.paperMark
      }
    });
  });

  return prisma.$transaction(operations);
};
