"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { packageSeed, type PackageRecord } from "../../lib/seed-data";

type CustomerInfo = {
  id: string;
  name: string;
  email: string;
};

type OrderResult = {
  order: {
    id: string;
    name: string;
    email: string;
    project: string;
    durationMonths: number;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
  };
  package: {
    name: string;
    resource: string;
    stack: string;
  };
  paymentDetails: {
    method: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountHolder: string;
    totalAmount: number;
  };
};

function formatIDR(amount: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
}

function OrderFormContent() {
  const searchParams = useSearchParams();
  const initialPackageParam = searchParams.get("package");

  const [packages, setPackages] = useState<PackageRecord[]>(packageSeed);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageParam || packageSeed[0].id,
  );
  const [durationMonths, setDurationMonths] = useState<number>(1);

  // Visitor vs Customer state
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [notes, setNotes] = useState("");

  const [loadingAuth, setLoadingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [completedOrder, setCompletedOrder] = useState<OrderResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Check if visitor is logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/account");
        if (response.ok) {
          const data = await response.json();
          if (data.customer) {
            setCustomer(data.customer);
            setName(data.customer.name);
            setEmail(data.customer.email);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoadingAuth(false);
      }
    }

    async function loadPackages() {
      try {
        const response = await fetch("/api/packages");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setPackages(data);
          }
        }
      } catch (err) {
        console.error("Failed to load packages:", err);
      }
    }

    checkAuth();
    loadPackages();
  }, []);

  // Update selected package if param changes
  useEffect(() => {
    if (initialPackageParam && packages.some((p) => p.id === initialPackageParam)) {
      setSelectedPackageId(initialPackageParam);
    }
  }, [initialPackageParam, packages]);

  // Selected package details
  const selectedPackage = useMemo(() => {
    return packages.find((p) => p.id === selectedPackageId) || packages[0];
  }, [packages, selectedPackageId]);

  // Pricing calculations
  const setupFee = selectedPackage.setupPrice * 1000;
  const monthlyFee = selectedPackage.monthlyPrice * 1000 * durationMonths;
  const devopsFee = 25000;
  const totalAmount = setupFee + monthlyFee + devopsFee;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your contact email address.");
      return;
    }

    if (!project.trim()) {
      setError("Please enter your project or assignment name.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          project: project.trim(),
          packageId: selectedPackage.id,
          durationMonths,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to process order. Please try again.");
        return;
      }

      setCompletedOrder(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCopyAccount() {
    navigator.clipboard.writeText("102938495821");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function getOrderWhatsAppUrl(orderResult: OrderResult) {
    const text = `Halo Kak Sendiko, saya telah melakukan pemesanan hosting baru:
- Order ID: ${orderResult.order.id}
- Project: ${orderResult.order.project}
- Paket: ${orderResult.package.name} (${orderResult.package.resource})
- Durasi: ${orderResult.order.durationMonths} Bulan
- Total Transfer: ${formatIDR(orderResult.order.totalAmount)} (ke Bank Jago)

Mohon konfirmasi dan proses setup deploymentnya kak. Terima kasih!`;

    return `https://wa.me/6285171119432?text=${encodeURIComponent(text)}`;
  }

  if (completedOrder) {
    return (
      <main className="order-shell">
        <div className="order-success-card">
          <span style={{ fontSize: "36px", color: "var(--green)" }}>✔</span>
          <p className="eyebrow" style={{ color: "var(--green)", marginTop: "12px" }}>Order Created Successfully</p>
          <h1>Thank you for your order!</h1>
          <p className="login-copy">
            Your hosting deployment request has been registered. Please complete the bank transfer below to proceed with server deployment.
          </p>

          <div className="order-ref-pill">
            ORDER ID: {completedOrder.order.id}
          </div>

          <div className="payment-box" style={{ textAlign: "left", marginBottom: "24px" }}>
            <div className="payment-box-header">
              <strong style={{ fontSize: "14px" }}>Transfer Instruction</strong>
              <span className="payment-tag">Bank Jago</span>
            </div>

            <div className="payment-details-row">
              <span>Bank Name:</span>
              <strong>{completedOrder.paymentDetails.bankName} (Kode: {completedOrder.paymentDetails.bankCode})</strong>
            </div>

            <div className="payment-details-row">
              <span>Account Number:</span>
              <strong style={{ letterSpacing: "1px" }}>{completedOrder.paymentDetails.accountNumber}</strong>
            </div>

            <div className="payment-details-row">
              <span>Account Holder:</span>
              <strong>{completedOrder.paymentDetails.accountHolder}</strong>
            </div>

            <div className="payment-details-row" style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--line)" }}>
              <span>Total Amount to Transfer:</span>
              <strong style={{ color: "var(--green)", fontSize: "16px" }}>{formatIDR(completedOrder.order.totalAmount)}</strong>
            </div>

            <button
              onClick={handleCopyAccount}
              type="button"
              className="admin-secondary-button"
              style={{ width: "100%", marginTop: "12px", textAlign: "center" }}
            >
              {copied ? "Copied to Clipboard!" : "Copy Account Number"}
            </button>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <a
              href={getOrderWhatsAppUrl(completedOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="button"
              style={{ justifyContent: "center" }}
            >
              Confirm Transfer via WhatsApp <span>↗</span>
            </a>

            {customer ? (
              <Link href="/account" className="admin-secondary-button" style={{ textAlign: "center", lineHeight: "36px" }}>
                View in My Account Dashboard ↗
              </Link>
            ) : (
              <Link href="/" className="admin-secondary-button" style={{ textAlign: "center", lineHeight: "36px" }}>
                ← Return to Home
              </Link>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="account-wrapper">
      {/* Navigation Bar */}
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

            {customer ? (
              <Link href="/account" className="admin-status" style={{ border: "1px solid var(--indigo)", color: "var(--foreground)" }}>
                Account: {customer.name} ↗
              </Link>
            ) : (
              <Link href="/account/login" className="admin-preview-link" style={{ color: "var(--indigo)" }}>
                Sign In ↗
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="order-shell">
        <div>
          <p className="eyebrow">Homelab Hosting / Place An Order</p>
          <h1 style={{ fontSize: "clamp(30px, 4.5vw, 42px)", margin: "8px 0 12px" }}>
            Deploy your project.
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0, maxWidth: "600px", lineHeight: "1.6" }}>
            Select your preferred stack, resource capacity, and duration. You'll receive your custom domain and live container ready for your final presentation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="order-layout">
          {/* Main Form Fields */}
          <div className="order-form-section">
            {/* Contact / Identity Section */}
            <div className="order-panel">
              <span className="eyebrow">Step 01 / Contact Information</span>
              <h2 className="order-panel-title">Customer Information</h2>
              <p className="order-panel-desc">
                {customer
                  ? "You are logged in. This order will automatically link to your customer account."
                  : "Enter your contact details so we can reach you with deployment credentials."}
              </p>

              {customer && (
                <div className="order-badge-registered">
                  <span>✔ Signed in as <strong>{customer.name}</strong> ({customer.email})</span>
                  <Link href="/account" style={{ color: "var(--indigo)", textDecoration: "underline" }}>
                    Manage Profile
                  </Link>
                </div>
              )}

              <div className="admin-form" style={{ marginTop: 0 }}>
                <label>
                  Full Name
                  <input
                    required
                    placeholder="e.g. Ahmad Fauzi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!!customer}
                    style={customer ? { opacity: 0.8, cursor: "not-allowed" } : {}}
                  />
                </label>

                <label>
                  Contact Email
                  <input
                    required
                    type="email"
                    placeholder="e.g. ahmad.fauzi@student.ac.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!customer}
                    style={customer ? { opacity: 0.8, cursor: "not-allowed" } : {}}
                  />
                </label>

                {!customer && !loadingAuth && (
                  <p style={{ color: "var(--muted)", fontSize: "11px", margin: "4px 0 0", fontFamily: "var(--font-geist-mono), monospace" }}>
                    Already have an account? <Link href="/account/login" style={{ color: "var(--indigo)" }}>Sign in ↗</Link> to link this deployment to your dashboard.
                  </p>
                )}
              </div>
            </div>

            {/* Project Details Section */}
            <div className="order-panel">
              <span className="eyebrow">Step 02 / Project Details</span>
              <h2 className="order-panel-title">What are you deploying?</h2>
              <p className="order-panel-desc">Tell us what project or assignment you are hosting.</p>

              <div className="admin-form" style={{ marginTop: 0 }}>
                <label>
                  Project / Assignment Name
                  <input
                    required
                    placeholder="e.g. Sistem Informasi Manajemen Perpustakaan"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  />
                </label>

                <label>
                  Repository URL or Stack Notes (Optional)
                  <input
                    placeholder="e.g. https://github.com/student/my-repo or MySQL + Laravel 11"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
              </div>
            </div>

            {/* Package Selection */}
            <div className="order-panel">
              <span className="eyebrow">Step 03 / Hosting Capacity</span>
              <h2 className="order-panel-title">Select Package</h2>
              <p className="order-panel-desc">Choose the technology stack and resource allocation.</p>

              <div className="admin-form" style={{ marginTop: 0 }}>
                <label>
                  Hosting Package
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — {pkg.resource} (Rp {pkg.monthlyPrice}K/mo)
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ marginTop: "16px", padding: "14px", background: "#0b0c12", border: "1px solid var(--line)", fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "var(--muted)" }}>
                <div>Stack: <strong style={{ color: "var(--foreground)" }}>{selectedPackage.stack}</strong></div>
                <div style={{ marginTop: "6px" }}>Resource: <strong style={{ color: "var(--foreground)" }}>{selectedPackage.resource}</strong></div>
                <div style={{ marginTop: "6px" }}>Base Monthly Price: <strong style={{ color: "var(--green)" }}>Rp {selectedPackage.monthlyPrice}K / month</strong></div>
              </div>
            </div>

            {/* Duration Selection */}
            <div className="order-panel">
              <span className="eyebrow">Step 04 / Service Duration</span>
              <h2 className="order-panel-title">Choose Duration</h2>
              <p className="order-panel-desc">Select how many months you want the project hosted.</p>

              <div className="duration-grid">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`duration-btn ${durationMonths === m ? "active" : ""}`}
                    onClick={() => setDurationMonths(m)}
                  >
                    <div>{m} {m === 1 ? "Month" : "Months"}</div>
                    <small>Rp {(selectedPackage.monthlyPrice * m)}K</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="order-panel">
              <span className="eyebrow">Step 05 / Payment Method</span>
              <h2 className="order-panel-title">Payment Method</h2>
              <p className="order-panel-desc">Direct bank transfer for student project hosting.</p>

              <div className="payment-box">
                <div className="payment-box-header">
                  <div>
                    <strong style={{ fontSize: "13px" }}>Bank Transfer</strong>
                    <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>
                      Bank Jago (Placeholder Account)
                    </div>
                  </div>
                  <span className="payment-tag">Available</span>
                </div>

                <div className="payment-details-row">
                  <span>Bank Name:</span>
                  <strong>Bank Jago (Kode: 542)</strong>
                </div>

                <div className="payment-details-row">
                  <span>No. Rekening:</span>
                  <strong style={{ letterSpacing: "1px" }}>1029-3849-5821</strong>
                </div>

                <div className="payment-details-row">
                  <span>Atas Nama:</span>
                  <strong>Muhammad Sendiko</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Summary Sidebar */}
          <div className="order-summary-sidebar">
            <span className="eyebrow">Order Summary</span>
            <h3 style={{ fontSize: "18px", margin: "10px 0 4px" }}>Cost Breakdown</h3>
            <p style={{ color: "var(--muted)", fontSize: "11px", margin: 0, fontFamily: "var(--font-geist-mono), monospace" }}>
              Transparent pricing, all inclusions included.
            </p>

            <div className="order-summary-rows">
              <div className="order-summary-row">
                <span>Package:</span>
                <strong style={{ color: "var(--foreground)" }}>{selectedPackage.name}</strong>
              </div>

              <div className="order-summary-row">
                <span>Allocation:</span>
                <span>{selectedPackage.resource}</span>
              </div>

              <div className="order-summary-row">
                <span>Duration:</span>
                <span>{durationMonths} {durationMonths === 1 ? "Month" : "Months"}</span>
              </div>

              <div className="order-summary-row">
                <span>Docker Setup Fee:</span>
                <span>{formatIDR(setupFee)}</span>
              </div>

              <div className="order-summary-row">
                <span>Monthly Hosting ({durationMonths}mo):</span>
                <span>{formatIDR(monthlyFee)}</span>
              </div>

              <div className="order-summary-row">
                <span>DevOps & Health Check (1st mo):</span>
                <span>{formatIDR(devopsFee)}</span>
              </div>

              <div className="order-summary-row total">
                <span>Total Payment:</span>
                <span className="price-val">{formatIDR(totalAmount)}</span>
              </div>
            </div>

            {error && (
              <p className="account-error" role="alert" style={{ margin: "0 0 16px" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="admin-primary-button"
              style={{ width: "100%", justifyContent: "center", height: "46px", fontSize: "12px" }}
            >
              {submitting ? "Processing Order..." : "Confirm & Place Order"} <span>↗</span>
            </button>

            <p style={{ color: "var(--muted)", fontSize: "10px", marginTop: "14px", textAlign: "center", fontFamily: "var(--font-geist-mono), monospace" }}>
              Includes custom subdomain, SSL certificate, 1 database container & deployment monitoring.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="account-wrapper" style={{ justifyContent: "center", alignItems: "center" }}>
        <p className="eyebrow" style={{ color: "var(--muted)" }}>Loading order form...</p>
      </div>
    }>
      <OrderFormContent />
    </Suspense>
  );
}
