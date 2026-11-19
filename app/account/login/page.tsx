"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const isId = language === "id";
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("sendiko_lang") as "id" | "en" | null;
    if (saved && (saved === "id" || saved === "en")) {
      setLanguage(saved);
    }
  }, []);

  function switchLanguage(lang: "id" | "en") {
    setLanguage(lang);
    try {
      localStorage.setItem("sendiko_lang", lang);
    } catch {}
  }

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
        setError(data.error || (isId ? "Alamat email atau kata sandi tidak valid." : "Invalid email or password."));
        return;
      }

      router.push("/account");
      router.refresh();
    } catch (requestError) {
      console.error(requestError);
      setError(isId ? "Tidak dapat terhubung ke server. Silakan coba lagi." : "Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
          <Link className="brand" href="/">
            <span className="brand-mark">SSH</span>
            <span className="brand-name">Sendiko Service Hosting</span>
          </Link>
          <div className="language-switcher" aria-label="Pilih bahasa / Choose language">
            <button className={isId ? "active" : ""} onClick={() => switchLanguage("id")} type="button">ID</button>
            <button className={!isId ? "active" : ""} onClick={() => switchLanguage("en")} type="button">EN</button>
          </div>
        </div>

        <p className="eyebrow">{isId ? "portal customer / masuk" : "customer portal / sign in"}</p>
        <h1>{isId ? "Selamat datang kembali." : "Welcome back."}</h1>
        <p className="login-copy">
          {isId
            ? "Masuk untuk mengelola detail akun dan melihat status hosting project-mu."
            : "Sign in to manage your account details and view your hosted services."}
        </p>

        <form className="admin-form login-form" onSubmit={submit}>
          <label>
            {isId ? "alamat email" : "email address"}
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
            {isId ? "kata sandi" : "password"}
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
            {isLoading
              ? (isId ? "sedang masuk..." : "signing in...")
              : (isId ? "masuk" : "sign in")} <span>↗</span>
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace" }}>
          <Link href="/account/register" style={{ color: "var(--indigo)" }}>
            {isId ? "Belum punya akun? Daftar ↗" : "Need an account? Sign up ↗"}
          </Link>
          <Link href="/" style={{ color: "var(--muted)" }}>
            {isId ? "← Beranda" : "← Home"}
          </Link>
        </div>
      </section>
    </main>
  );
}
