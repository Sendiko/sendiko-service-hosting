"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setError(response.status === 503 ? "Admin account is not configured." : "Invalid username or password.");
        return;
      }
      router.push("/admin");
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to reach the server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <Link className="brand login-brand" href="/">
          <span className="brand-mark">SSH</span>
          <span className="brand-name">Sendiko Service Hosting</span>
        </Link>
        <p className="eyebrow">private workspace / sign in</p>
        <h1>Welcome back.</h1>
        <p className="login-copy">Sign in to manage your packages and client records.</p>
        <form className="admin-form login-form" onSubmit={submit}>
          <label>username<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} /></label>
          <label>password<input autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="admin-primary-button" disabled={isLoading} type="submit">{isLoading ? "signing in..." : "sign in"} <span>↗</span></button>
        </form>
      </section>
    </main>
  );
}
