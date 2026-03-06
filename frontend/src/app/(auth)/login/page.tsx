"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("token", data.token);

        alert("Login successful");

        // redirect to dashboard
        router.push("/dashboard");

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
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

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login to Portal"}
          </button>

        </form>

      </div>

    </div>
  );
}