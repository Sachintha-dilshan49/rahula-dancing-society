import { Request, Response } from 'express';
import path from 'path';
import * as galleryService from '../services/gallery.service';
import { GalleryCategory, MediaType } from '@prisma/client';

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await galleryService.getAllGalleryItems();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const { title, category } = req.body;
    const ext = path.extname(file.originalname).toLowerCase();
    const videoExts = ['.mp4', '.mov', '.avi', '.webm'];
    const mediaType: MediaType = videoExts.includes(ext) ? 'VIDEO' : 'PHOTO';

    const item = await galleryService.createGalleryItem({
      title: String(title),
      mediaType,
      category: category as GalleryCategory,
      url: `/uploads/${file.filename}`,
    });

    res.status(201).json({ item });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    await galleryService.deleteGalleryItem(String(req.params.id));
    res.json({ message: 'Gallery item deleted' });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const incrementViews = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await galleryService.incrementViews(String(req.params.id));
    res.json({ item });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
