import { authService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface QuizQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer?: string; // Only for teachers
  orderIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  grade: number;
  startTime: string;
  endTime: string;
  duration: number;
  isPublished: boolean;
  questions?: QuizQuestion[];
  _count?: {
    questions: number;
    attempts: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  totalMarks: number;
  submittedAt: string;
  student?: {
    id: string;
    name: string;
    grade: number;
  };
}

export const quizService = {
  getHeaders() {
    const token = authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  },

  async handleResponse(response: Response, defaultError: string) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || defaultError);
    }
    return response.json();
  },

  async getQuizzes(grade?: number): Promise<Quiz[]> {
    const url = new URL(`${API_URL}/quizzes`);
    if (grade) url.searchParams.append('grade', grade.toString());
    
    const response = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response, 'Failed to fetch quizzes');
  },

  async getQuizById(id: string): Promise<Quiz> {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response, 'Failed to fetch quiz');
  },

  async createQuiz(data: any): Promise<Quiz> {
    const response = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response, 'Failed to create quiz');
  },

  async updateQuiz(id: string, data: any): Promise<Quiz> {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response, 'Failed to update quiz');
  },

  async deleteQuiz(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to delete quiz');
    }
  },

  async parseFile(file: File): Promise<{ text: string }> {
    const token = authService.getToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/quizzes/parse-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return this.handleResponse(response, 'Failed to parse file');
  },

  async submitAttempt(quizId: string, answers: Record<string, string>): Promise<QuizAttempt> {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/attempt`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ answers }),
    });
    return this.handleResponse(response, 'Failed to submit quiz');
  },

  async getMyAttempt(quizId: string): Promise<QuizAttempt | null> {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/my-attempt`, {
      headers: this.getHeaders(),
    });
    if (response.status === 404 || response.status === 204) return null;
    if (!response.ok) return null;
    return response.json();
  },

  async getAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/attempts`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response, 'Failed to fetch attempts');
  },
};
