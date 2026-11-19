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

  // Language state
  const [language, setLanguage] = useState<"id" | "en">("id");
  const isId = language === "id";

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
    } catch { }
  }

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
      setError(isId ? "Silakan masukkan nama lengkapmu." : "Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError(isId ? "Silakan masukkan alamat email kontakmu." : "Please enter your contact email address.");
      return;
    }

    if (!project.trim()) {
      setError(isId ? "Silakan masukkan nama project atau tugas kuliahmu." : "Please enter your project or assignment name.");
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
        setError(data.error || (isId ? "Gagal memproses pesanan. Silakan coba lagi." : "Unable to process order. Please try again."));
        return;
      }

      setCompletedOrder(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(isId ? "Terjadi kesalahan jaringan. Silakan coba lagi." : "Network error. Please try again.");
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
    const text = isId
      ? `Halo Kak Sendiko, saya telah melakukan pemesanan hosting baru:
- Order ID: ${orderResult.order.id}
- Project: ${orderResult.order.project}
- Paket: ${orderResult.package.name} (${orderResult.package.resource})
- Durasi: ${orderResult.order.durationMonths} Bulan
- Total Transfer: ${formatIDR(orderResult.order.totalAmount)} (ke Bank Jago)

Mohon konfirmasi dan proses setup deploymentnya kak. Terima kasih!`
      : `Hi Sendiko, I just placed a new hosting order:
- Order ID: ${orderResult.order.id}
- Project: ${orderResult.order.project}
- Package: ${orderResult.package.name} (${orderResult.package.resource})
- Duration: ${orderResult.order.durationMonths} Month(s)
- Total Transfer: ${formatIDR(orderResult.order.totalAmount)} (to Bank Jago)

Please confirm and proceed with deployment setup. Thank you!`;

    return `https://wa.me/6285171119432?text=${encodeURIComponent(text)}`;
  }

  if (completedOrder) {
    return (
      <main className="order-shell">
        <div className="order-success-card">
          <span style={{ fontSize: "36px", color: "var(--green)" }}>✔</span>
          <p className="eyebrow" style={{ color: "var(--green)", marginTop: "12px" }}>
            {isId ? "Pesanan Berhasil Dibuat" : "Order Created Successfully"}
          </p>
          <h1>{isId ? "Terima kasih atas pesananmu!" : "Thank you for your order!"}</h1>
          <p className="login-copy">
            {isId
              ? "Permintaan deployment hosting-mu telah tercatat. Silakan lakukan transfer bank di bawah ini untuk memulai proses deployment server."
              : "Your hosting deployment request has been registered. Please complete the bank transfer below to proceed with server deployment."}
          </p>

          <div className="order-ref-pill">
            {isId ? "ID PESANAN" : "ORDER ID"}: {completedOrder.order.id}
          </div>

          <div className="payment-box" style={{ textAlign: "left", marginBottom: "24px" }}>
            <div className="payment-box-header">
              <strong style={{ fontSize: "14px" }}>{isId ? "Instruksi Transfer" : "Transfer Instruction"}</strong>
              <span className="payment-tag">Bank Jago</span>
            </div>

            <div className="payment-details-row">
              <span>{isId ? "Nama Bank:" : "Bank Name:"}</span>
              <strong>{completedOrder.paymentDetails.bankName} ({isId ? "Kode" : "Code"}: {completedOrder.paymentDetails.bankCode})</strong>
            </div>

            <div className="payment-details-row">
              <span>{isId ? "Nomor Rekening:" : "Account Number:"}</span>
              <strong style={{ letterSpacing: "1px" }}>{completedOrder.paymentDetails.accountNumber}</strong>
            </div>

            <div className="payment-details-row">
              <span>{isId ? "Atas Nama:" : "Account Holder:"}</span>
              <strong>{completedOrder.paymentDetails.accountHolder}</strong>
            </div>

            <div className="payment-details-row" style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--line)" }}>
              <span>{isId ? "Total yang Harus Ditransfer:" : "Total Amount to Transfer:"}</span>
              <strong style={{ color: "var(--green)", fontSize: "16px" }}>{formatIDR(completedOrder.order.totalAmount)}</strong>
            </div>

            <button
              onClick={handleCopyAccount}
              type="button"
              className="admin-secondary-button"
              style={{ width: "100%", marginTop: "12px", textAlign: "center" }}
            >
              {copied
                ? (isId ? "Tersalin ke Clipboard!" : "Copied to Clipboard!")
                : (isId ? "Salin Nomor Rekening" : "Copy Account Number")}
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
              {isId ? "Konfirmasi Transfer via WhatsApp" : "Confirm Transfer via WhatsApp"} <span>↗</span>
            </a>

            {customer ? (
              <Link href="/account" className="admin-secondary-button" style={{ textAlign: "center", lineHeight: "36px" }}>
                {isId ? "Lihat di Dashboard Akun Saya ↗" : "View in My Account Dashboard ↗"}
              </Link>
            ) : (
              <Link href="/" className="admin-secondary-button" style={{ textAlign: "center", lineHeight: "36px" }}>
                {isId ? "← Kembali ke Beranda" : "← Return to Home"}
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
            <div className="language-switcher" aria-label={isId ? "Pilih bahasa" : "Choose language"}>
              <button className={isId ? "active" : ""} onClick={() => switchLanguage("id")} type="button">ID</button>
              <button className={!isId ? "active" : ""} onClick={() => switchLanguage("en")} type="button">EN</button>
            </div>
            <Link href="/" className="admin-preview-link">
              {isId ? "← Kembali ke Website" : "← Back to Site"}
            </Link>

            {customer ? (
              <Link href="/account" className="admin-status" style={{ border: "1px solid var(--indigo)", color: "var(--foreground)" }}>
                {isId ? "Akun: " : "Account: "}{customer.name} ↗
              </Link>
            ) : (
              <Link href="/account/login" className="admin-preview-link" style={{ color: "var(--indigo)" }}>
                {isId ? "Masuk ↗" : "Sign In ↗"}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="order-shell">
        <div>
          <p className="eyebrow">{isId ? "Hosting Homelab / Buat Pesanan" : "Homelab Hosting / Place An Order"}</p>
          <h1 style={{ fontSize: "clamp(30px, 4.5vw, 42px)", margin: "8px 0 12px" }}>
            {isId ? "Deploy project kuliahmu." : "Deploy your project."}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "14px", margin: 0, maxWidth: "600px", lineHeight: "1.6" }}>
            {isId
              ? "Pilih stack teknologi, kapasitas resource, dan durasi hosting. Dapatkan subdomain custom dan container live siap untuk demo dan penilaian."
              : "Select your preferred stack, resource capacity, and duration. You'll receive your custom domain and live container ready for your final presentation."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="order-layout">
          {/* Main Form Fields */}
          <div className="order-form-section">
            {/* Contact / Identity Section */}
            <div className="order-panel">
              <span className="eyebrow">{isId ? "Langkah 01 / Informasi Kontak" : "Step 01 / Contact Information"}</span>
              <h2 className="order-panel-title">{isId ? "Informasi Customer" : "Customer Information"}</h2>
              <p className="order-panel-desc">
                {customer
                  ? (isId ? "Kamu sedang masuk. Pesanan ini akan otomatis terhubung ke akun customer-mu." : "You are logged in. This order will automatically link to your customer account.")
                  : (isId ? "Masukkan data kontak agar kami dapat mengirimkan kredensial deployment." : "Enter your contact details so we can reach you with deployment credentials.")}
              </p>

              {customer && (
                <div className="order-badge-registered">
                  <span>✔ {isId ? "Masuk sebagai" : "Signed in as"} <strong>{customer.name}</strong> ({customer.email})</span>
                  <Link href="/account" style={{ color: "var(--indigo)", textDecoration: "underline" }}>
                    {isId ? "Kelola Profil" : "Manage Profile"}
                  </Link>
                </div>
              )}

              <div className="admin-form" style={{ marginTop: 0 }}>
                <label>
                  {isId ? "Nama Lengkap" : "Full Name"}
                  <input
                    required
                    placeholder={isId ? "contoh: Ahmad Fauzi" : "e.g. Ahmad Fauzi"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!!customer}
                    style={customer ? { opacity: 0.8, cursor: "not-allowed" } : {}}
                  />
                </label>

                <label>
                  {isId ? "Alamat Email Kontak" : "Contact Email"}
                  <input
                    required
                    type="email"
                    placeholder={isId ? "contoh: ahmad.fauzi@student.ac.id" : "e.g. ahmad.fauzi@student.ac.id"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!customer}
                    style={customer ? { opacity: 0.8, cursor: "not-allowed" } : {}}
                  />
                </label>

                {!customer && !loadingAuth && (
                  <p style={{ color: "var(--muted)", fontSize: "11px", margin: "4px 0 0", fontFamily: "var(--font-geist-mono), monospace" }}>
                    {isId ? "Sudah punya akun? " : "Already have an account? "}
                    <Link href="/account/login" style={{ color: "var(--indigo)" }}>
                      {isId ? "Masuk ↗" : "Sign in ↗"}
                    </Link>
                    {isId ? " untuk menghubungkan deployment ini ke dashboard-mu." : " to link this deployment to your dashboard."}
                  </p>
                )}
              </div>
            </div>

            {/* Project Details Section */}
            <div className="order-panel">
              <span className="eyebrow">{isId ? "Langkah 02 / Detail Project" : "Step 02 / Project Details"}</span>
              <h2 className="order-panel-title">{isId ? "Apa yang akan kamu deploy?" : "What are you deploying?"}</h2>
              <p className="order-panel-desc">{isId ? "Beritahu kami nama project atau tugas yang akan kamu hosting." : "Tell us what project or assignment you are hosting."}</p>

              <div className="admin-form" style={{ marginTop: 0 }}>
                <label>
                  {isId ? "Nama Project / Tugas Kuliah" : "Project / Assignment Name"}
                  <input
                    required
                    placeholder={isId ? "contoh: Sistem Informasi Manajemen Perpustakaan" : "e.g. Library Management Information System"}
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  />
                </label>

                <label>
                  {isId ? "URL Repository atau Catatan Stack (Opsional)" : "Repository URL or Stack Notes (Optional)"}
                  <input
                    placeholder={isId ? "contoh: https://github.com/student/my-repo atau MySQL + Laravel 11" : "e.g. https://github.com/student/my-repo or MySQL + Laravel 11"}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
              </div>
            </div>

            {/* Package Selection */}
            <div className="order-panel">
              <span className="eyebrow">{isId ? "Langkah 03 / Kapasitas Hosting" : "Step 03 / Hosting Capacity"}</span>
              <h2 className="order-panel-title">{isId ? "Pilih Paket" : "Select Package"}</h2>
              <p className="order-panel-desc">{isId ? "Pilih stack teknologi dan alokasi resource." : "Choose the technology stack and resource allocation."}</p>

              <div className="admin-form" style={{ marginTop: 0 }}>
                <label>
                  {isId ? "Paket Hosting" : "Hosting Package"}
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — {pkg.resource} (Rp {pkg.monthlyPrice}K{isId ? "/bulan" : "/mo"})
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ marginTop: "16px", padding: "14px", background: "#0b0c12", border: "1px solid var(--line)", fontSize: "11px", fontFamily: "var(--font-geist-mono), monospace", color: "var(--muted)" }}>
                <div>{isId ? "Stack: " : "Stack: "}<strong style={{ color: "var(--foreground)" }}>{selectedPackage.stack}</strong></div>
                <div style={{ marginTop: "6px" }}>{isId ? "Sumber Daya: " : "Resource: "}<strong style={{ color: "var(--foreground)" }}>{selectedPackage.resource}</strong></div>
                <div style={{ marginTop: "6px" }}>{isId ? "Biaya Bulanan Dasar: " : "Base Monthly Price: "}<strong style={{ color: "var(--green)" }}>Rp {selectedPackage.monthlyPrice}K {isId ? "/ bulan" : "/ month"}</strong></div>
              </div>
            </div>

            {/* Duration Selection */}
            <div className="order-panel">
              <span className="eyebrow">{isId ? "Langkah 04 / Durasi Layanan" : "Step 04 / Service Duration"}</span>
              <h2 className="order-panel-title">{isId ? "Pilih Durasi" : "Choose Duration"}</h2>
              <p className="order-panel-desc">{isId ? "Pilih berapa bulan project ingin di-hosting." : "Select how many months you want the project hosted."}</p>

              <div className="duration-grid">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`duration-btn ${durationMonths === m ? "active" : ""}`}
                    onClick={() => setDurationMonths(m)}
                  >
                    <div>{m} {isId ? "Bulan" : (m === 1 ? "Month" : "Months")}</div>
                    <small>Rp {(selectedPackage.monthlyPrice * m)}K</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="order-panel">
              <span className="eyebrow">{isId ? "Langkah 05 / Metode Pembayaran" : "Step 05 / Payment Method"}</span>
              <h2 className="order-panel-title">{isId ? "Metode Pembayaran" : "Payment Method"}</h2>
              <p className="order-panel-desc">{isId ? "Transfer bank langsung untuk hosting project mahasiswa." : "Direct bank transfer for student project hosting."}</p>

              <div className="payment-box">
                <div className="payment-box-header">
                  <div>
                    <strong style={{ fontSize: "13px" }}>{isId ? "Transfer Bank" : "Bank Transfer"}</strong>
                    <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>
                      Bank Jago ({isId ? "Rekening Placeholder" : "Placeholder Account"})
                    </div>
                  </div>
                  <span className="payment-tag">{isId ? "Tersedia" : "Available"}</span>
                </div>

                <div className="payment-details-row">
                  <span>{isId ? "Nama Bank:" : "Bank Name:"}</span>
                  <strong>Bank Jago ({isId ? "Kode" : "Code"}: 542)</strong>
                </div>

                <div className="payment-details-row">
                  <span>{isId ? "No. Rekening:" : "Account Number:"}</span>
                  <strong style={{ letterSpacing: "1px" }}>1029-3849-5821</strong>
                </div>

                <div className="payment-details-row">
                  <span>{isId ? "Atas Nama:" : "Account Holder:"}</span>
                  <strong>Muhammad Sendiko</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Summary Sidebar */}
          <div className="order-summary-sidebar">
            <span className="eyebrow">{isId ? "Ringkasan Pesanan" : "Order Summary"}</span>
            <h3 style={{ fontSize: "18px", margin: "10px 0 4px" }}>{isId ? "Rincian Biaya" : "Cost Breakdown"}</h3>
            <p style={{ color: "var(--muted)", fontSize: "11px", margin: 0, fontFamily: "var(--font-geist-mono), monospace" }}>
              {isId ? "Harga transparan, semua fitur sudah termasuk." : "Transparent pricing, all inclusions included."}
            </p>

            <div className="order-summary-rows">
              <div className="order-summary-row">
                <span>{isId ? "Paket:" : "Package:"}</span>
                <strong style={{ color: "var(--foreground)" }}>{selectedPackage.name}</strong>
              </div>

              <div className="order-summary-row">
                <span>{isId ? "Alokasi:" : "Allocation:"}</span>
                <span>{selectedPackage.resource}</span>
              </div>

              <div className="order-summary-row">
                <span>{isId ? "Durasi:" : "Duration:"}</span>
                <span>{durationMonths} {isId ? "Bulan" : (durationMonths === 1 ? "Month" : "Months")}</span>
              </div>

              <div className="order-summary-row">
                <span>{isId ? "Biaya Setup Docker:" : "Docker Setup Fee:"}</span>
                <span>{formatIDR(setupFee)}</span>
              </div>

              <div className="order-summary-row">
                <span>{isId ? `Hosting Bulanan (${durationMonths}bln):` : `Monthly Hosting (${durationMonths}mo):`}</span>
                <span>{formatIDR(monthlyFee)}</span>
              </div>

              <div className="order-summary-row">
                <span>{isId ? "DevOps & Health Check (Bln 1):" : "DevOps & Health Check (1st mo):"}</span>
                <span>{formatIDR(devopsFee)}</span>
              </div>

              <div className="order-summary-row total">
                <span>{isId ? "Total Pembayaran:" : "Total Payment:"}</span>
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
              {submitting
                ? (isId ? "Memproses Pesanan..." : "Processing Order...")
                : (isId ? "Konfirmasi & Buat Pesanan" : "Confirm & Place Order")} <span>↗</span>
            </button>

            <p style={{ color: "var(--muted)", fontSize: "10px", marginTop: "14px", textAlign: "center", fontFamily: "var(--font-geist-mono), monospace" }}>
              {isId
                ? "Termasuk subdomain custom, sertifikat SSL, 1 database container & monitoring deployment."
                : "Includes custom subdomain, SSL certificate, 1 database container & deployment monitoring."}
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

function OrderPageFallback() {
  const [isId, setIsId] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sendiko_lang");
    if (saved === "en") setIsId(false);
  }, []);

  return (
    <div className="account-wrapper" style={{ justifyContent: "center", alignItems: "center" }}>
      <p className="eyebrow" style={{ color: "var(--muted)" }}>
        {isId ? "Memuat formulir pesanan..." : "Loading order form..."}
      </p>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<OrderPageFallback />}>
      <OrderFormContent />
    </Suspense>
  );
}