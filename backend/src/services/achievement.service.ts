import { prisma } from '../config/prisma';

export const getAllAchievements = () =>
  prisma.achievement.findMany({ orderBy: { year: 'desc' } });

export const createAchievement = async (data: {
  title: string;
  placement: string;
  subtitle?: string | null;
  year: number;
  description?: string | null;
}) => {
  return prisma.achievement.create({ data });
};

export const updateAchievement = async (id: string, data: {
  title?: string;
  placement?: string;
  subtitle?: string | null;
  year?: number;
  description?: string | null;
}) => {
  return prisma.achievement.update({ where: { id }, data });
};

export const deleteAchievement = async (id: string) => {
  return prisma.achievement.delete({ where: { id } });
};
