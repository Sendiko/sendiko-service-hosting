"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password.length < 6) {
      setError(isId ? "Kata sandi minimal harus 6 karakter." : "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError(isId ? "Konfirmasi kata sandi tidak cocok." : "Passwords do not match.");
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
        setError(data.error || (isId ? "Tidak dapat membuat akun." : "Unable to create account."));
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

        <p className="eyebrow">{isId ? "portal customer / pendaftaran" : "customer portal / sign up"}</p>
        <h1>{isId ? "Buat akun baru." : "Create account."}</h1>
        <p className="login-copy">
          {isId
            ? "Buat akun customer-mu untuk mengelola hosting dan kredensial akun."
            : "Create your customer account to manage your hosting and personal credentials."}
        </p>

        <form className="admin-form login-form" onSubmit={submit}>
          <label>
            {isId ? "nama lengkap" : "full name"}
            <input
              autoComplete="name"
              placeholder="Ahmad Fauzi"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
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
              autoComplete="new-password"
              placeholder={isId ? "Min. 6 karakter" : "Min. 6 characters"}
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <label>
            {isId ? "konfirmasi kata sandi" : "confirm password"}
            <input
              autoComplete="new-password"
              placeholder={isId ? "Ulangi kata sandi" : "Repeat your password"}
              required
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="admin-primary-button" disabled={isLoading} type="submit">
            {isLoading
              ? (isId ? "sedang membuat akun..." : "creating account...")
              : (isId ? "buat akun" : "create account")} <span>↗</span>
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace" }}>
          <Link href="/account/login" style={{ color: "var(--indigo)" }}>
            {isId ? "Sudah punya akun? Masuk ↗" : "Already have an account? Sign in ↗"}
          </Link>
          <Link href="/" style={{ color: "var(--muted)" }}>
            {isId ? "← Beranda" : "← Home"}
          </Link>
        </div>
      </section>
    </main>
  );
}
