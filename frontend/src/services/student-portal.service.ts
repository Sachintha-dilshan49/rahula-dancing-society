import { authService } from "./auth.service";

const API_URL = "http://localhost:5000/api";

export interface StudentProfile {
  id: string;
  name: string;
  grade: number;
  email: string | null;
  phone: string | null;
  parentContact: string | null;
  notes: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentMark {
  id: string;
  studentId: string;
  grade: number;
  term: number;
  practicalMark: number | null;
  paperMark: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  studentProfile: StudentProfile | null;
}

export const studentPortalService = {
  async getMyProfile(): Promise<MeResponse> {
    const token = authService.getToken();
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  },

  async getMyMarks(): Promise<StudentMark[]> {
    const token = authService.getToken();
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${API_URL}/marks/my-marks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch marks");
    }

    return response.json();
  },
};
