import { prisma } from '../config/prisma';
import { GalleryCategory, MediaType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

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
  const item = await prisma.galleryItem.findUnique({ where: { id } });

  // Remove the underlying upload from disk so deletes don't leave orphaned files.
  if (item?.url) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', path.basename(item.url));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Failed to delete gallery file:', err);
    }
  }

  return prisma.galleryItem.delete({ where: { id } });
};

export const incrementViews = async (id: string) => {
  return prisma.galleryItem.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
};
