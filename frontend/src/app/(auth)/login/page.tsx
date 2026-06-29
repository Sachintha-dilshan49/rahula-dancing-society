"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { authService } from "@/services/auth.service";
import { API_URL } from "@/config/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleLogin = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        authService.setToken(data.token);
        const role = authService.getRoleFromToken();
        if (role === "STUDENT") {
          router.push("/student/dashboard");
        } else {
          router.push("/teacher/dashboard");
        }
      } else {
        setErrorMsg(data.message || "Login failed. Please try again.");
      }
    } catch {
      setErrorMsg("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="card">

        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#143a7b] text-sm font-medium transition-colors duration-200 mb-6 group"
          style={{ display: "flex", marginBottom: "24px" }}
        >
          <ArrowLeft size={15} style={{ transition: "transform 0.2s" }} className="group-hover:-translate-x-1" />
          Back to Home
        </Link>

        <h1>Welcome Back</h1>
        <p>Login to access the portal</p>

        <form onSubmit={handleLogin}>

          {/* Email */}
          <label style={{ display: "block", textAlign: "left", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
            Email Address
          </label>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <Mail size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
            <input
              type="email"
              placeholder="your.email@rahulacollege.lk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ paddingLeft: "38px", marginBottom: 0 }}
            />
          </div>

          {/* Password */}
          <label style={{ display: "block", textAlign: "left", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
            Password
          </label>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingLeft: "38px", paddingRight: "40px", marginBottom: 0 }}
            />
            <span
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </span>
          </div>

          {/* Forgot */}
          <div className="forgot">
            <Link href="/forgot-password" style={{ color: "#143a7b", fontSize: "0.8rem", fontWeight: 500 }}>
              Forgot Password?
            </Link>
          </div>

          {/* Error */}
          {errorMsg && (
            <div style={{
              color: "#dc2626",
              fontSize: "0.8rem",
              marginBottom: "14px",
              padding: "10px 14px",
              background: "#fef2f2",
              borderRadius: "8px",
              border: "1px solid #fecaca",
              textAlign: "left",
            }}>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              transform: "scale(1)",
              transition: "background 0.2s, transform 0.1s",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: "15px", height: "15px",
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }} />
                Signing in...
              </>
            ) : "Login to Portal"}
          </button>

        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-container input:focus {
          outline: none;
          border-color: #143a7b;
          box-shadow: 0 0 0 3px rgba(20, 58, 123, 0.12);
        }
        .login-container button[type="submit"]:hover:not(:disabled) {
          background: #0f2e63;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(20,58,123,0.28);
        }
        .login-container button[type="submit"]:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
