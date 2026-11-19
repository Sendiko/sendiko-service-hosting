"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CustomerData = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

type ProjectData = {
  id: string;
  name: string;
  project: string;
  status: string;
  contact: string;
  package?: {
    name: string;
    resource: string;
    monthlyPrice: number;
  } | null;
  billings?: Array<{
    id: string;
    amount: number;
    date: string;
    paymentMethod: string;
  }>;
};

type OrderData = {
  id: string;
  project: string;
  durationMonths: number;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  package?: {
    name: string;
    resource: string;
  } | null;
};

export default function AccountPage() {
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch("/api/account");
        if (response.status === 401) {
          router.push("/account/login");
          return;
        }
        if (!response.ok) {
          throw new Error("Unable to load account information.");
        }
        const data = await response.json();
        setCustomer(data.customer);
        setName(data.customer.name);
        setEmail(data.customer.email);
        setProjects(data.projects || []);
        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, [router]);

  async function handleUpdateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setProfileError(data.error || "Failed to update profile.");
        return;
      }

      setCustomer((prev) => (prev ? { ...prev, name: data.customer.name, email: data.customer.email } : null));
      setProfileSuccess("Account profile updated successfully.");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch (error) {
      console.error(error);
      setProfileError("Network error. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPasswordError(data.error || "Failed to change password.");
        return;
      }

      setPasswordSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(""), 4000);
    } catch (error) {
      console.error(error);
      setPasswordError("Network error. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/account/logout", { method: "POST" });
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/account/login");
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="account-wrapper" style={{ justifyContent: "center", alignItems: "center" }}>
        <p className="eyebrow" style={{ color: "var(--muted)" }}>Loading customer account...</p>
      </div>
    );
  }

  const initials = customer?.name
    ? customer.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CU";

  return (
    <div className="account-wrapper">
      <header className="account-topbar">
        <div className="account-topbar-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">SSH</span>
            <span className="brand-name">Sendiko Service Hosting</span>
          </Link>

          <div className="account-user-action">
            <Link href="/" className="admin-preview-link">
              ← Back to Site
            </Link>
            <div className="account-avatar">{initials}</div>
            <button
              onClick={handleLogout}
              className="admin-secondary-button"
              type="button"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="account-content">
        <section className="account-hero">
          <div>
            <p className="eyebrow">Customer Portal / Account Management</p>
            <h1>{customer?.name || "Customer Account"}</h1>
            <div className="account-hero-meta">
              <span>{customer?.email}</span>
              <span>·</span>
              <span className="admin-status">Active Account</span>
              {customer?.createdAt && (
                <>
                  <span>·</span>
                  <span>Member since {new Date(customer.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</span>
                </>
              )}
            </div>
          </div>
          <Link href="/order" className="button button-small" style={{ alignSelf: "center" }}>
            Deploy New Project ↗
          </Link>
        </section>

        <section className="account-grid">
          {/* Personal Info & Email Management */}
          <div className="account-card">
            <div className="account-card-header">
              <span className="eyebrow">Profile Details</span>
              <h2>Personal Information</h2>
              <p>Update your display name and contact email address.</p>
            </div>

            {profileSuccess && <p className="account-success" role="alert">{profileSuccess}</p>}
            {profileError && <p className="account-error" role="alert">{profileError}</p>}

            <form className="admin-form" onSubmit={handleUpdateProfile}>
              <label>
                Full Name
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </label>

              <label>
                Email Address
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your contact email"
                />
              </label>

              <div className="admin-form-actions">
                <button
                  className="admin-primary-button"
                  disabled={profileLoading}
                  type="submit"
                >
                  {profileLoading ? "Saving changes..." : "Save Changes"} <span>↗</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password & Security Management */}
          <div className="account-card">
            <div className="account-card-header">
              <span className="eyebrow">Security</span>
              <h2>Password Management</h2>
              <p>Change your account password to keep your credentials safe.</p>
            </div>

            {passwordSuccess && <p className="account-success" role="alert">{passwordSuccess}</p>}
            {passwordError && <p className="account-error" role="alert">{passwordError}</p>}

            <form className="admin-form" onSubmit={handleUpdatePassword}>
              <label>
                Current Password
                <input
                  required
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </label>

              <label>
                New Password
                <input
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                />
              </label>

              <label>
                Confirm New Password
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                />
              </label>

              <div className="admin-form-actions">
                <button
                  className="admin-primary-button"
                  disabled={passwordLoading}
                  type="submit"
                >
                  {passwordLoading ? "Updating..." : "Update Password"} <span>↗</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Hosted Projects & Services Overview */}
        <section className="account-full-card">
          <div className="account-card-header">
            <span className="eyebrow">Hosted Services</span>
            <h2>Your Projects & Deployments</h2>
            <p>Active and past project environments associated with your account.</p>
          </div>

          {projects.length > 0 ? (
            <div className="project-card-list">
              {projects.map((proj) => (
                <div key={proj.id} className="project-card">
                  <div className="project-header">
                    <strong>{proj.project}</strong>
                    <span className={`admin-status ${proj.status.toLowerCase()}`}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="project-details">
                    <span>Client: {proj.name}</span>
                    {proj.package && (
                      <>
                        <span>Package: {proj.package.name}</span>
                        <span>Resource: {proj.package.resource}</span>
                        <span className="admin-price">Rp {proj.package.monthlyPrice}K/month</span>
                      </>
                    )}
                  </div>
                  {proj.billings && proj.billings.length > 0 && (
                    <div style={{ fontSize: "10px", color: "var(--muted)", borderTop: "1px solid var(--line)", paddingTop: "8px" }}>
                      Latest payment: Rp {new Intl.NumberFormat("id-ID").format(proj.billings[0].amount)} ({proj.billings[0].paymentMethod}) on {proj.billings[0].date.slice(0, 10)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="account-empty-state">
              <span className="service-icon" style={{ fontSize: "28px", color: "var(--indigo)" }}>⚡</span>
              <h3>No active hosting deployments yet</h3>
              <p>
                Have a repository ready for your presentation or class assignment? Reach out via WhatsApp with your code repository and target deadline to get your custom live URL.
              </p>
              <a
                className="button button-small"
                href="https://wa.me/6285171119432?text=Halo%20Kak%20Sendiko%2C%20saya%20sudah%20buat%20akun%20customer%20dan%20ingin%20hosting%20project."
                target="_blank"
                rel="noopener noreferrer"
              >
                Request Deployment via WhatsApp ↗
              </a>
            </div>
          )}
        </section>
        {/* Orders & Invoices History */}
        <section className="account-full-card">
          <div className="account-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <span className="eyebrow">Orders & Invoices</span>
              <h2>Your Hosting Orders</h2>
              <p>Recent orders placed through your account and their payment status.</p>
            </div>
            <Link href="/order" className="admin-primary-button" style={{ height: "34px", display: "inline-flex", alignItems: "center" }}>
              Place New Order ↗
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="project-card-list">
              {orders.map((ord) => (
                <div key={ord.id} className="project-card">
                  <div className="project-header">
                    <div>
                      <strong>{ord.project}</strong>
                      <small style={{ color: "var(--muted)", display: "block", fontFamily: "var(--font-geist-mono), monospace", fontSize: "10px", marginTop: "2px" }}>
                        Order ID: {ord.id}
                      </small>
                    </div>
                    <span className={`admin-status ${ord.status === "Pending" ? "lead" : ""}`}>
                      {ord.status}
                    </span>
                  </div>
                  <div className="project-details">
                    {ord.package && <span>Package: {ord.package.name} ({ord.package.resource})</span>}
                    <span>Duration: {ord.durationMonths} {ord.durationMonths === 1 ? "Month" : "Months"}</span>
                    <span>Method: {ord.paymentMethod}</span>
                    <span className="admin-price">Total: Rp {new Intl.NumberFormat("id-ID").format(ord.totalAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="account-empty-state">
              <span className="service-icon" style={{ fontSize: "28px", color: "var(--indigo)" }}>📦</span>
              <h3>No order history yet</h3>
              <p>You haven't placed any hosting orders yet. Start by selecting your required package and duration.</p>
              <Link href="/order" className="button button-small">
                Order Hosting Now ↗
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
