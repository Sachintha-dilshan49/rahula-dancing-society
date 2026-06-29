import { authService } from './auth.service';

const API_URL = 'http://localhost:5000/api';

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${authService.getToken()}` };
}

export type MediaType = 'PHOTO' | 'VIDEO';
export type GalleryCategory = 'PERFORMANCES' | 'REHEARSALS' | 'AWARDS' | 'CULTURAL_EVENTS';

export interface GalleryItem {
  id: string;
  title: string;
  mediaType: MediaType;
  category: GalleryCategory;
  url: string;
  date: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export const galleryService = {
  async getAll(): Promise<GalleryItem[]> {
    const res = await fetch(`${API_URL}/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  async upload(file: File, title: string, category: GalleryCategory): Promise<GalleryItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);

    const res = await fetch(`${API_URL}/gallery`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload media');
    const r = await res.json();
    return r.item;
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/gallery/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to delete gallery item');
  },

  async incrementViews(id: string): Promise<void> {
    await fetch(`${API_URL}/gallery/${id}/views`, { method: 'PATCH' });
  },

  getMediaUrl(url: string): string {
    return `http://localhost:5000${url}`;
  },
};
