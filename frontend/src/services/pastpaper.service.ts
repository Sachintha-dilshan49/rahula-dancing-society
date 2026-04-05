import { authService } from './auth.service';

const API_URL = 'http://localhost:5000/api';

export interface PastPaper {
  id: string;
  title: string;
  grade: number;
  term: number | null;
  year: number;
  fileUrl: string;
  uploadedAt: string;
}

const getHeaders = (isFormData = false) => {
  const token = authService.getToken();
  const headers: any = {
    Authorization: `Bearer ${token}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const pastPaperService = {
  getPastPapers: async (grade?: number | 'all', term?: number | 'all'): Promise<PastPaper[]> => {
    const params = new URLSearchParams();
    if (grade && grade !== 'all') params.append("grade", grade.toString());
    if (term && term !== 'all') params.append("term", term.toString());
    
    const res = await fetch(`${API_URL}/pastpapers?${params.toString()}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch past papers');
    return res.json();
  },

  uploadPastPaper: async (data: FormData): Promise<PastPaper> => {
    const res = await fetch(`${API_URL}/pastpapers`, {
      method: 'POST',
      headers: getHeaders(true),
      body: data
    });
    if (!res.ok) throw new Error('Failed to upload past paper');
    return res.json();
  },

  updatePastPaper: async (id: string, data: FormData): Promise<PastPaper> => {
    const res = await fetch(`${API_URL}/pastpapers/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: data
    });
    if (!res.ok) throw new Error('Failed to update past paper');
    return res.json();
  },

  deletePastPaper: async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/pastpapers/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete past paper');
  }
};
