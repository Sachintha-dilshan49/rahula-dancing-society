"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/api";

export default function VerifyOtp() {

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const email = typeof window !== "undefined"
    ? localStorage.getItem("resetEmail")
    : null;

  const handleVerify = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp
      }),
    });

    const data = await res.json();

    if (res.ok) {

      // Persist the verified OTP so the reset-password step can prove it server-side.
      localStorage.setItem("resetOtp", otp);

      setMessage("OTP verified successfully ");

      setTimeout(() => {
        router.push("/reset-password");
      }, 1500);

    } else {
      setMessage(data.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">

      <div className="card">

        <h1>Verify OTP</h1>
        <p>Enter the OTP sent to your email</p>

        <form onSubmit={handleVerify}>

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />

          <button type="submit" disabled={loading}>

            {loading ? "Verifying..." : "Verify OTP"}

          </button>

        </form>

        {message && (
          <p style={{
            marginTop: "15px",
            color: message.includes("success") ? "green" : "red"
          }}>
            {message}
          </p>
        )}

      </div>

    </div>
  );
}