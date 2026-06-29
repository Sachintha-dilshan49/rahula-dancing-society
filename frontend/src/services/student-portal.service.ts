import { authService } from "./auth.service";
import { API_URL } from "@/config/api";

export interface StudentProfile {
  id: string;
  name: string;
  grade: number;
  email: string | null;
  phone: string | null;
  parentContact: string | null;
  notes: string | null;
  photoUrl: string | null;
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

  // Student updates their own photo only — the server resolves the student from
  // the auth token, so no id is sent or accepted.
  async updateMyPhoto(photo: File): Promise<{ student: StudentProfile }> {
    const token = authService.getToken();
    if (!token) throw new Error("No authentication token found");

    const form = new FormData();
    form.append("photo", photo);

    const response = await fetch(`${API_URL}/students/me/photo`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Failed to update photo");
    }

    return response.json();
  },
};
