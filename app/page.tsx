const apiPlans = [
  { range: "0–20 endpoints", setup: "50K", monthly: "50K", total: "125K" },
  { range: "20–50 endpoints", setup: "50K", monthly: "100K", total: "175K" },
  { range: "50–70 endpoints", setup: "50K", monthly: "150K", total: "225K" },
];

const laravelPlans = [
  { range: "0–20 endpoints", setup: "65K", monthly: "50K", total: "135K" },
  { range: "20–50 endpoints", setup: "65K", monthly: "100K", total: "185K" },
  { range: "50–70 endpoints", setup: "65K", monthly: "150K", total: "235K" },
];

const javascriptWebsitePlans = [
  { range: "0–20 pages", setup: "50K", monthly: "50K", total: "125K" },
  { range: "20–50 pages", setup: "50K", monthly: "100K", total: "175K" },
  { range: "50–70 pages", setup: "50K", monthly: "150K", total: "225K" },
];

const laravelWebsitePlans = [
  { range: "0–20 pages", setup: "65K", monthly: "50K", total: "135K" },
  { range: "20–50 pages", setup: "65K", monthly: "100K", total: "185K" },
  { range: "50–70 pages", setup: "65K", monthly: "150K", total: "235K" },
];

function ArrowUpRight() {
  return <span aria-hidden="true">↗</span>;
}

function Check() {
  return <span className="check" aria-hidden="true">+</span>;
}

function PricingTable({
  title,
  description,
  plans,
}: {
  title: string;
  description: string;
  plans: typeof apiPlans;
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
              <th>scope</th>
              <th>setup</th>
              <th>monthly</th>
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
              <td>70+ / custom</td>
              <td colSpan={3}>chat to discuss <ArrowUpRight /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="table-note">*first month: setup + monthly + DevOps support (Rp 25K)</p>
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Nodehouse home">
          <span className="brand-mark"><span /></span>
          <span>nodehouse<span className="brand-dot">.</span></span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">how it works</a>
          <a href="#pricing">pricing</a>
          <a href="#boundaries">the fine print</a>
        </div>
        <a className="button button-small" href="#contact">deploy my project <ArrowUpRight /></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="status-label"><span className="live-dot" /> homelab / online <span className="status-separator">·</span> accepting projects</div>
          <h1>Ship your<br /><span>assignment.</span><br />Skip the server.</h1>
          <p className="hero-lede">A small, local hosting service for student projects. You bring the code. I handle Docker, domains, databases, and the 2am deployment panic.</p>
          <div className="hero-actions">
            <a className="button" href="#pricing">see the pricing <ArrowUpRight /></a>
            <a className="text-link" href="#how-it-works">how it works <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <div><strong>01</strong><span>one less<br />deadline worry</span></div>
            <div><strong>24/7</strong><span>reachable<br />for grading day</span></div>
            <div><strong>0</strong><span>Linux terminal<br />required</span></div>
          </div>
        </div>

      </section>

      <section className="trust-strip">
        <div className="shell trust-inner">
          <span className="eyebrow">built for the stack you already use</span>
          <div className="stack-list"><span>Docker</span><span>Next.js</span><span>Laravel</span><span>Node.js</span><span>MySQL</span><span>PostgreSQL</span></div>
        </div>
      </section>

      <section className="section shell" id="how-it-works">
        <div className="section-heading">
          <div><p className="eyebrow">01 / the handoff</p><h2>From <em>“works on my machine”</em><br />to <span>works on a URL.</span></h2></div>
          <p>Hosting should be the easy part of your project. Send the repo, tell me the deadline, and get back to building what your lecturer actually grades.</p>
        </div>
        <div className="steps">
          <div className="step"><span className="step-number">01</span><h3>Send the repo</h3><p>Share your GitHub repo and a short note about your stack. Containerized is ideal; a little messy is okay.</p><span className="step-arrow">↘</span></div>
          <div className="step"><span className="step-number">02</span><h3>I make it reachable</h3><p>Docker setup, environment variables, database connection, SSL, and a custom subdomain. Handled.</p><span className="step-arrow">↘</span></div>
          <div className="step"><span className="step-number">03</span><h3>You share the link</h3><p>Get a live URL for your presentation, grading, or portfolio. Basic health checks keep it there.</p><span className="step-arrow">↘</span></div>
        </div>
      </section>

      <section className="section pricing-section" id="pricing">
        <div className="shell">
          <div className="section-heading pricing-heading">
            <div><p className="eyebrow">02 / transparent pricing</p><h2>Pay for the<br /><span>scope, not the hype.</span></h2></div>
            <p>All prices in thousands of Indonesian Rupiah. No mystery tiers, no enterprise theatre. Pick the row that matches your project and we&apos;ll confirm the details.</p>
          </div>
          <div className="pricing-grid">
            <PricingTable title="JavaScript API" description="Express, NestJS, Fastify, and friends." plans={apiPlans} />
            <PricingTable title="Laravel API" description="PHP API hosting with a clean Docker setup." plans={laravelPlans} />
            <PricingTable title="JavaScript Website" description="Next.js, React, and other JavaScript sites." plans={javascriptWebsitePlans} />
            <PricingTable title="Laravel Website" description="Laravel websites with a clean Docker setup." plans={laravelWebsitePlans} />
          </div>
          <div className="included-bar"><span className="eyebrow">every project includes</span><span><Check /> Docker deployment</span><span><Check /> custom subdomain</span><span><Check /> 1 database container</span><span><Check /> basic health checks</span></div>
        </div>
      </section>

      <section className="section shell" id="boundaries">
        <div className="boundary-card">
          <div><p className="eyebrow">03 / architectural honesty</p><h2>Good hosting has<br /><span>boundaries.</span></h2></div>
          <div className="boundary-copy"><p>This is a homelab built for assignments, demos, and final projects—not banking infrastructure. Uptime is best-effort, and the service is designed around your grading window.</p><p>The setup fee assumes your code can build. Debugging application logic, rewriting broken repositories, or emergency fixes the night before a deadline are separate conversations.</p><a className="text-link" href="#contact">read the full scope <ArrowUpRight /></a></div>
        </div>
      </section>

      <section className="cta-section shell" id="contact">
        <div className="cta-grid">
          <div><p className="eyebrow">ready when you are</p><h2>Your project deserves<br /><span>a live URL.</span></h2></div>
          <div className="cta-action"><p>Tell me what you&apos;re building, when it&apos;s due, and where the repo lives.</p><a className="button" href="mailto:hello@nodehouse.local?subject=Project%20hosting%20request">start a conversation <ArrowUpRight /></a></div>
        </div>
      </section>

      <footer className="footer shell"><a className="brand" href="#top"><span className="brand-mark"><span /></span><span>nodehouse<span className="brand-dot">.</span></span></a><span>student hosting, from a small room in Jakarta.</span><span className="footer-code">SYS / 2025—∞</span></footer>
    </main>
  );
}
