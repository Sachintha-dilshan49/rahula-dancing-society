"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("resetEmail")
      : null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        newPassword: password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setMessage("Password reset successful ");
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="login-container">

      <div className="card">

        <h1>Reset Password</h1>

        {!success ? (

          <form onSubmit={handleReset}>

            <label>New Password</label>

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit">
              Reset Password
            </button>

          </form>

        ) : (

          <div style={{ textAlign: "center" }}>
            <p style={{ color: "green", marginBottom: "20px" }}>
              {message}
            </p>

            <button onClick={() => router.push("/login")}>
              Back to Login
            </button>
          </div>

        )}

        {!success && message && (
          <p style={{ marginTop: "10px", color: "red" }}>
            {message}
          </p>
        )}

      </div>

    </div>
  );
}