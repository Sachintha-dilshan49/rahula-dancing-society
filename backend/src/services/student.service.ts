import { prisma } from "../config/prisma";

export const createStudent = async (data: any) => {
  return prisma.student.create({
    data
  });
};

export const getStudents = async () => {
  return prisma.student.findMany({
    orderBy: { createdAt: "desc" }
  });
};

export const getStudentById = async (id: string) => {
  return prisma.student.findUnique({
    where: { id }
  });
};

export const updateStudent = async (id: string, data: any) => {
  return prisma.student.update({
    where: { id },
    data
  });
};

export const deleteStudent = async (id: string) => {
  return prisma.student.delete({
    where: { id }
  });
};

export const promoteStudents = async () => {
  return prisma.student.updateMany({
    data: {
      grade: {
        increment: 1
      }
    }
  });
};