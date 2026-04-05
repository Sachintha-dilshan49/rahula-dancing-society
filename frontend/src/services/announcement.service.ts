import { authService } from './auth.service';

const API_URL = 'http://localhost:5000/api';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  grade: number | null;
  createdAt: string;
  updatedAt: string;
}

const getHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

export const announcementService = {
  getAnnouncements: async (grade?: number | 'all'): Promise<Announcement[]> => {
    let url = `${API_URL}/announcements`;
    if (grade && grade !== 'all') {
      url += `?grade=${grade}`;
    }
    
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  createAnnouncement: async (data: { title: string; description: string; grade?: number | null }): Promise<Announcement> => {
    const res = await fetch(`${API_URL}/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create announcement' }));
      throw new Error(err.message || 'Failed to create announcement');
    }
    return res.json();
  },

  updateAnnouncement: async (id: string, data: { title?: string; description?: string; grade?: number | null }): Promise<Announcement> => {
    const res = await fetch(`${API_URL}/announcements/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update announcement');
    return res.json();
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete announcement');
  }
};
