"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to reach the server. Please try again.");
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
        <p className="eyebrow">customer portal / sign in</p>
        <h1>Welcome back.</h1>
        <p className="login-copy">Sign in to manage your account details and view your hosted services.</p>

        <form className="admin-form login-form" onSubmit={submit}>
          <label>
            email address
            <input
              autoComplete="email"
              placeholder="you@student.ac.id"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            password
            <input
              autoComplete="current-password"
              placeholder="••••••••"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="admin-primary-button" disabled={isLoading} type="submit">
            {isLoading ? "signing in..." : "sign in"} <span>↗</span>
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace" }}>
          <Link href="/account/register" style={{ color: "var(--indigo)" }}>
            Need an account? Sign up ↗
          </Link>
          <Link href="/" style={{ color: "var(--muted)" }}>
            ← Home
          </Link>
        </div>
      </section>
    </main>
  );
}
