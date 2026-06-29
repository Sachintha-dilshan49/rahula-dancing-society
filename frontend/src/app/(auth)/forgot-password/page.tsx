"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/api";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {

      localStorage.setItem("resetEmail", email);

      setMessage("OTP sent to your email");

      setTimeout(() => {
        router.push("/verify-otp");
      }, 1500);

    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="login-container">

      <div className="card">

        <h1>Forgot Password</h1>
        <p>Enter your email to receive OTP</p>

        <form onSubmit={handleSendOtp}>

          <label>Email</label>

          <input
            type="email"
            placeholder="your.email@rahula.lk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Send OTP
          </button>

        </form>

        {/* message display */}
        {message && (
          <p style={{ marginTop: "15px", color: "green" }}>
            {message}
          </p>
        )}

      </div>

    </div>
  );
}