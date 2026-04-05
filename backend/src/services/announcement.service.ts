import { prisma } from "../config/prisma";

export const createAnnouncement = async (data: { title: string; description: string; grade?: number }) => {
  return prisma.announcement.create({ data });
};

export const getAnnouncements = async (filters: { grade?: number }) => {
  const where: any = {};
  
  if (filters.grade) {
    where.OR = [
      { grade: filters.grade },
      { grade: null }
    ];
  }

  return prisma.announcement.findMany({
    where,
    orderBy: { createdAt: "desc" }
  });
};

export const updateAnnouncement = async (id: string, data: { title?: string; description?: string; grade?: number | null }) => {
  return prisma.announcement.update({
    where: { id },
    data
  });
};

export const deleteAnnouncement = async (id: string) => {
  return prisma.announcement.delete({ where: { id } });
};
