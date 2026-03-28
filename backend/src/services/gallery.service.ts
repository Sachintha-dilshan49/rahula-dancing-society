import { prisma } from '../config/prisma';
import { GalleryCategory, MediaType } from '@prisma/client';

export const getAllGalleryItems = () =>
  prisma.galleryItem.findMany({ orderBy: { date: 'desc' } });

export const createGalleryItem = async (data: {
  title: string;
  mediaType: MediaType;
  category: GalleryCategory;
  url: string;
  date?: Date;
}) => {
  return prisma.galleryItem.create({ data });
};

export const deleteGalleryItem = async (id: string) => {
  return prisma.galleryItem.delete({ where: { id } });
};

export const incrementViews = async (id: string) => {
  return prisma.galleryItem.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
};
