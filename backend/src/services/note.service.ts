import { prisma } from "../config/prisma";

export const createNote = async (data: { title: string; content: string; studentId: string }) => {
  return prisma.note.create({
    data,
    include: { student: { select: { name: true, grade: true } } }
  });
};

export const createNoteForGrade = async (grade: number, data: { title: string; content: string }) => {
  const students = await prisma.student.findMany({ where: { grade } });
  if (students.length === 0) return [];

  const notes = await Promise.all(
    students.map((student) =>
      prisma.note.create({
        data: { ...data, studentId: student.id },
        include: { student: { select: { name: true, grade: true } } }
      })
    )
  );
  return notes;
};

export const getNotesForStudent = async (studentId: string) => {
  return prisma.note.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" }
  });
};

export const getAllNotes = async (filters?: { studentId?: string; grade?: number }) => {
  const where: any = {};
  if (filters?.studentId) where.studentId = filters.studentId;
  if (filters?.grade) where.student = { grade: filters.grade };

  return prisma.note.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, grade: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const deleteNote = async (id: string) => {
  return prisma.note.delete({ where: { id } });
};
