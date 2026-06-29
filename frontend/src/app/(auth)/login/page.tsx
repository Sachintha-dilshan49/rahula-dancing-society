"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok) {

        authService.setToken(data.token);

        // Decode role and redirect accordingly
        const role = authService.getRoleFromToken();

        if (role === "STUDENT") {
          router.push("/student/dashboard");
        } else {
          router.push("/teacher/dashboard");
        }

      } else {
        setErrorMsg(data.message || 'Login failed. Please try again.');
      }

    } catch (error) {
      console.error(error);
      setErrorMsg('Server error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">

      <div className="card">

        <h1>Welcome Back</h1>
        <p>Login to access the portal</p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="your.email@rahulacollege.lk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot">
            <Link href="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          {errorMsg && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '0.75rem', padding: '0.75rem', background: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fecaca' }}>
              {errorMsg}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to Portal"}
          </button>

        </form>

      </div>

    </div>
  );
}