const API_URL = "http://localhost:5000/api";

export const authService = {
  getToken() {
    return localStorage.getItem("token");
  },

  setToken(token: string) {
    localStorage.setItem("token", token);
  },

  removeToken() {
    localStorage.removeItem("token");
  },

  decodeToken(): { id: string; role: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      return { id: payload.id, role: payload.role };
    } catch {
      return null;
    }
  },

  getRoleFromToken(): string | null {
    const decoded = this.decodeToken();
    return decoded?.role || null;
  },

  async getMe() {
    const token = this.getToken();
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    return response.json();
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const token = this.getToken();
    if (!token) throw new Error("No authentication token found");

    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to change password");
    }

    return response.json();
  },
};
