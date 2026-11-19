"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Unable to create account.");
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
        <p className="eyebrow">customer portal / sign up</p>
        <h1>Create account.</h1>
        <p className="login-copy">Create your customer account to manage your hosting and personal credentials.</p>

        <form className="admin-form login-form" onSubmit={submit}>
          <label>
            full name
            <input
              autoComplete="name"
              placeholder="Ahmad Fauzi"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
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
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label>
            confirm password
            <input
              autoComplete="new-password"
              placeholder="Repeat your password"
              required
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="admin-primary-button" disabled={isLoading} type="submit">
            {isLoading ? "creating account..." : "create account"} <span>↗</span>
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace" }}>
          <Link href="/account/login" style={{ color: "var(--indigo)" }}>
            Already have an account? Sign in ↗
          </Link>
          <Link href="/" style={{ color: "var(--muted)" }}>
            ← Home
          </Link>
        </div>
      </section>
    </main>
  );
}
