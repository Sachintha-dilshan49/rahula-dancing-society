import { authService } from './auth.service';

const API_URL = 'http://localhost:5000/api';

export interface Note {
  id: string;
  title: string;
  content: string;
  studentId: string;
  student?: { id: string; name: string; grade: number };
  createdAt: string;
  updatedAt: string;
}

const getHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const noteService = {
  // Student: get my own notes
  getMyNotes: async (): Promise<Note[]> => {
    const res = await fetch(`${API_URL}/notes/my`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  // Teacher: get all sent notes (optional filters)
  getAllNotes: async (filters?: { studentId?: string; grade?: number | 'all' }): Promise<Note[]> => {
    let url = `${API_URL}/notes`;
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.grade && filters.grade !== 'all') params.append('grade', String(filters.grade));
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
  },

  // Teacher: send note to a single student
  createNote: async (data: { title: string; content: string; studentId: string }): Promise<Note> => {
    const res = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to send note' }));
      throw new Error(err.message || 'Failed to send note');
    }
    return res.json();
  },

  // Teacher: send note to an entire grade
  createNoteForGrade: async (data: { title: string; content: string; grade: number }): Promise<Note[]> => {
    const res = await fetch(`${API_URL}/notes/group`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to send group note' }));
      throw new Error(err.message || 'Failed to send group note');
    }
    return res.json();
  },

  // Teacher: delete a note
  deleteNote: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete note');
  },
};
