"use client";

import { useState } from "react";

const apiPlans = [
  { range: "512MB RAM / 1GB storage", setup: "50K", monthly: "50K", total: "125K" },
  { range: "1GB RAM / 2GB storage", setup: "50K", monthly: "100K", total: "175K" },
  { range: "2GB RAM / 4GB storage", setup: "50K", monthly: "150K", total: "225K" },
];

const laravelPlans = [
  { range: "512MB RAM / 1GB storage", setup: "65K", monthly: "50K", total: "135K" },
  { range: "1GB RAM / 2GB storage", setup: "65K", monthly: "100K", total: "185K" },
  { range: "2GB RAM / 4GB storage", setup: "65K", monthly: "150K", total: "235K" },
];

const javascriptWebsitePlans = [
  { range: "512MB RAM / 1GB storage", setup: "50K", monthly: "50K", total: "125K" },
  { range: "1GB RAM / 2GB storage", setup: "50K", monthly: "100K", total: "175K" },
  { range: "2GB RAM / 4GB storage", setup: "50K", monthly: "150K", total: "225K" },
];

const laravelWebsitePlans = [
  { range: "512MB RAM / 1GB storage", setup: "65K", monthly: "50K", total: "135K" },
  { range: "1GB RAM / 2GB storage", setup: "65K", monthly: "100K", total: "185K" },
  { range: "2GB RAM / 4GB storage", setup: "65K", monthly: "150K", total: "235K" },
];

function ArrowUpRight() {
  return <span aria-hidden="true">↗</span>;
}

function Check() {
  return <span className="check" aria-hidden="true">+</span>;
}

function getWhatsAppUrl(language: "id" | "en") {
  const message = language === "id"
    ? "Halo Kak Sendiko, saya ingin bertanya tentang hosting project saya."
    : "Hi Sendiko, I'd like to ask about hosting my project.";

  return `https://wa.me/6285171119432?text=${encodeURIComponent(message)}`;
}

function PricingTable({
  title,
  description,
  plans,
  language,
}: {
  title: string;
  description: string;
  plans: typeof apiPlans;
  language: "id" | "en";
}) {
  return (
    <article className="pricing-card">
      <div className="pricing-card-header">
        <div>
          <p className="eyebrow">service / {title.toLowerCase()}</p>
          <h3>{title}</h3>
        </div>
        <span className="service-icon">↗</span>
      </div>
      <p className="pricing-description">{description}</p>
      <div className="price-table-wrap">
        <table className="price-table">
          <thead>
            <tr>
              <th>{language === "id" ? "resource" : "resource"}</th>
              <th>{language === "id" ? "setup" : "setup"}</th>
              <th>{language === "id" ? "bulanan" : "monthly"}</th>
              <th>total*</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.range}>
                <td>{plan.range}</td>
                <td>Rp {plan.setup}</td>
                <td>Rp {plan.monthly}</td>
                <td className="total-price">Rp {plan.total}</td>
              </tr>
            ))}
            <tr className="discuss-row">
              <td>2GB+ / {language === "id" ? "custom" : "custom"}</td>
              <td colSpan={3}>
                <a href={getWhatsAppUrl(language)} target="_blank" rel="noopener noreferrer">
                  {language === "id" ? "diskusikan" : "chat to discuss"} <ArrowUpRight />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="table-note">{language === "id" ? "*bulan pertama: setup + bulanan + dukungan DevOps (Rp 25K)" : "*first month: setup + monthly + DevOps support (Rp 25K)"}</p>
    </article>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<"id" | "en">("id");
  const isId = language === "id";

  return (
    <main>
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Sendiko Service Hosting home">
          <span className="brand-mark">SSH</span>
          <span className="brand-name">Sendiko Service Hosting</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">{isId ? "cara kerja" : "how it works"}</a>
          <a href="#pricing">{isId ? "harga" : "pricing"}</a>
          <a href="#boundaries">{isId ? "catatan penting" : "the fine print"}</a>
        </div>
        <div className="nav-actions">
          <div className="language-switcher" aria-label="Pilih bahasa / Choose language">
            <button className={isId ? "active" : ""} onClick={() => setLanguage("id")}>ID</button>
            <button className={!isId ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <a className="button button-small" href="#contact">{isId ? "deploy project saya" : "deploy my project"} <ArrowUpRight /></a>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="status-label"><span className="live-dot" /> homelab / online <span className="status-separator">·</span> {isId ? "menerima project" : "accepting projects"}</div>
          <h1>{isId ? <>Deploy <br /><span>tugas kuliah.</span><br />Tanpa pusing server.</> : <>Ship your<br /><span>assignment.</span><br />Skip the server.</>}</h1>
          <p className="hero-lede">{isId ? "Layanan hosting lokal untuk project mahasiswa. Kamu bawa kodenya. Saya urus Docker, domain, database, dan kepanikan deployment sebelum presentasi." : "A small, local hosting service for student projects. You bring the code. I handle Docker, domains, databases, and the before presentation deployment panic."}</p>
          <div className="hero-actions">
            <a className="button" href="#pricing">{isId ? "lihat harga" : "see the pricing"} <ArrowUpRight /></a>
            <a className="text-link" href="#how-it-works">{isId ? "cara kerjanya" : "how it works"} <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <div><strong>01</strong><span>{isId ? <>satu kekhawatiran<br />deadline lebih sedikit</> : <>one less<br />deadline worry</>}</span></div>
            <div><strong>24/7</strong><span>{isId ? <>siap diakses<br />saat presentasi</> : <>reachable<br />for grading day</>}</span></div>
            <div><strong>0</strong><span>{isId ? <>tidak perlu<br />terminal Linux</> : <>Linux terminal<br />required</>}</span></div>
          </div>
        </div>

      </section>

      <section className="trust-strip">
        <div className="shell trust-inner">
          <span className="eyebrow">{isId ? "dibuat untuk stack yang sudah kamu gunakan" : "built for the stack you already use"}</span>
          <div className="stack-list"><span>Docker</span><span>Next.js</span><span>Laravel</span><span>Node.js</span><span>MySQL</span><span>PostgreSQL</span></div>
        </div>
      </section>

      <section className="section shell" id="how-it-works">
        <div className="section-heading">
          <div><p className="eyebrow">01 / {isId ? "serah-terima" : "the handoff"}</p><h2>{isId ? <>Dari <em>“jalan di komputer saya”</em></> : <>From <em>“works on my machine”</em></>}<br />{isId ? <>menjadi <span>URL yang bisa dibuka.</span></> : <>to <span>works on a URL.</span></>}</h2></div>
          <p>{isId ? "Hosting seharusnya menjadi bagian termudah dari project. Kirim repo, beri tahu deadline, lalu kembali mengerjakan hal yang benar-benar dinilai dosen." : "Hosting should be the easy part of your project. Send the repo, tell me the deadline, and get back to building what your lecturer actually grades."}</p>
        </div>
        <div className="steps">
          {isId ? <>
            <div className="step"><span className="step-number">01</span><h3>Kirim repo</h3><p>Bagikan repo GitHub dan catatan singkat tentang stack-mu. Sudah pakai container lebih baik; sedikit berantakan masih oke.</p><span className="step-arrow">↘</span></div>
            <div className="step"><span className="step-number">02</span><h3>Saya buat bisa diakses</h3><p>Setup Docker, environment variables, koneksi database, SSL, dan subdomain custom. Semua ditangani.</p><span className="step-arrow">↘</span></div>
            <div className="step"><span className="step-number">03</span><h3>Bagikan link-nya</h3><p>Dapatkan URL live untuk presentasi, penilaian, atau portfolio. Health check dasar membantu menjaganya tetap online.</p><span className="step-arrow">↘</span></div>
          </> : <>
            <div className="step"><span className="step-number">01</span><h3>Send the repo</h3><p>Share your GitHub repo and a short note about your stack. Containerized is ideal; a little messy is okay.</p><span className="step-arrow">↘</span></div>
            <div className="step"><span className="step-number">02</span><h3>I make it reachable</h3><p>Docker setup, environment variables, database connection, SSL, and a custom subdomain. Handled.</p><span className="step-arrow">↘</span></div>
            <div className="step"><span className="step-number">03</span><h3>You share the link</h3><p>Get a live URL for your presentation, grading, or portfolio. Basic health checks keep it there.</p><span className="step-arrow">↘</span></div>
          </>}
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="shell">
          <div className="section-heading pricing-heading">
            <div><p className="eyebrow">02 / {isId ? "harga transparan" : "transparent pricing"}</p><h2>{isId ? "Bayar berdasarkan" : "Pay for the"}<br /><span>{isId ? "resource, bukan gimik." : "resources, not the hype."}</span></h2></div>
            <p>{isId ? "Semua harga dalam ribuan Rupiah. Tanpa tier misterius dan jargon enterprise. Pilih kapasitas RAM dan storage yang sesuai dengan project-mu, lalu kita konfirmasi detailnya." : "All prices in thousands of Indonesian Rupiah. No mystery tiers, no enterprise theatre. Pick the RAM and storage capacity that fits your project and we'll confirm the details."}</p>
          </div>
          <div className="pricing-grid">
            <PricingTable title="JavaScript API" description={isId ? "Express, NestJS, Fastify, dan lainnya." : "Express, NestJS, Fastify, and friends."} plans={apiPlans} language={language} />
            <PricingTable title="Laravel API" description={isId ? "Hosting API PHP dengan setup Docker yang rapi." : "PHP API hosting with a clean Docker setup."} plans={laravelPlans} language={language} />
            <PricingTable title="JavaScript Website" description={isId ? "Next.js, React, dan website JavaScript lainnya." : "Next.js, React, and other JavaScript sites."} plans={javascriptWebsitePlans} language={language} />
            <PricingTable title="Laravel Website" description={isId ? "Website Laravel dengan setup Docker yang rapi." : "Laravel websites with a clean Docker setup."} plans={laravelWebsitePlans} language={language} />
          </div>
          <div className="included-bar"><span className="eyebrow">{isId ? "setiap project termasuk" : "every project includes"}</span><span><Check /> {isId ? "deployment Docker" : "Docker deployment"}</span><span><Check /> {isId ? "subdomain custom" : "custom subdomain"}</span><span><Check /> {isId ? "1 container database" : "1 database container"}</span><span><Check /> {isId ? "health check dasar" : "basic health checks"}</span></div>
        </div>
      </section>

      <section className="section shell" id="boundaries">
        <div className="boundary-card">
          <div><p className="eyebrow">03 / {isId ? "kejujuran arsitektur" : "architectural honesty"}</p><h2>{isId ? "Hosting yang baik punya" : "Good hosting has"}<br /><span>{isId ? "batasan." : "boundaries."}</span></h2></div>
          <div className="boundary-copy"><p>{isId ? "Ini homelab untuk tugas, demo, dan final project—bukan infrastruktur perbankan. Uptime bersifat best-effort dan layanan ini dirancang untuk periode penilaianmu." : "This is a homelab built for assignments, demos, and final projects—not banking infrastructure. Uptime is best-effort, and the service is designed around your grading window."}</p><p>{isId ? "Biaya setup mengasumsikan kode bisa di-build. Debugging logika aplikasi, membenahi repo yang rusak, atau perbaikan darurat malam sebelum deadline adalah pembicaraan terpisah." : "The setup fee assumes your code can build. Debugging application logic, rewriting broken repositories, or emergency fixes the night before a deadline are separate conversations."}</p><p className="support-boundary"><strong>{isId ? "Dukungan personal: 06.00–18.00 WIB." : "Personal support: 06:00–18:00 WIB."}</strong> {isId ? "Pesan di luar jam tersebut akan dibalas pada jam operasional berikutnya." : "Messages outside these hours will be answered during the next support window."}</p></div>
        </div>
      </section>

      <section className="cta-section shell" id="contact">
        <div className="cta-grid">
          <div><p className="eyebrow">{isId ? "siap kapan saja" : "ready when you are"}</p><h2>{isId ? "Project-mu layak punya" : "Your project deserves"}<br /><span>{isId ? "URL live." : "a live URL."}</span></h2></div>
          <div className="cta-action"><p>{isId ? "Ceritakan apa yang sedang kamu buat, kapan deadline-nya, dan di mana repo-nya." : "Tell me what you're building, when it's due, and where the repo lives."}</p><a className="button" href={getWhatsAppUrl(language)} target="_blank" rel="noopener noreferrer">{isId ? "chat via WhatsApp" : "chat on WhatsApp"} <ArrowUpRight /></a></div>
        </div>
      </section>

      <footer className="footer shell"><a className="brand" href="#top" aria-label="Sendiko Service Hosting home"><span className="brand-mark">SSH</span><span className="brand-name">Sendiko Service Hosting</span></a><span>{isId ? "hosting mahasiswa, dari sebuah kamar kecil di Bandung." : "student hosting, from a small room in Bandung."}</span><span className="footer-code">SYS / 2025—∞</span></footer>
    </main>
  );
}
