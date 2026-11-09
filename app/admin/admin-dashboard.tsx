"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminSeed, clientSeed, packageSeed, type ClientRecord, type PackageRecord } from "../../lib/seed-data";

type Section = "overview" | "packages" | "clients";
type PackageForm = Omit<PackageRecord, "id">;
type ClientForm = Omit<ClientRecord, "id">;

const emptyPackage: PackageForm = { name: "", category: "API", stack: "", resource: "", setupPrice: 0, monthlyPrice: 0, active: true };
const emptyClient: ClientForm = { name: "", project: "", packageId: "", status: "Lead", contact: "" };

function formatPrice(value: number) { return `Rp ${value}K`; }
function makeId(prefix: string) { return `${prefix}-${Date.now()}`; }

export default function AdminPage({ section }: { section: Section }) {
  const [packages, setPackages] = useState<PackageRecord[]>(packageSeed);
  const [clients, setClients] = useState<ClientRecord[]>(clientSeed);
  const [packageForm, setPackageForm] = useState<PackageForm>(emptyPackage);
  const [clientForm, setClientForm] = useState<ClientForm>(emptyClient);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [packageSearch, setPackageSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [notice, setNotice] = useState("");
  const router = useRouter();

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  const loadData = useCallback(async () => {
    const [packageResponse, clientResponse] = await Promise.all([
      fetch("/api/admin/packages"),
      fetch("/api/admin/clients"),
    ]);
    if (packageResponse.status === 401 || clientResponse.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!packageResponse.ok || !clientResponse.ok) throw new Error("Unable to load admin data.");
    setPackages(await packageResponse.json() as PackageRecord[]);
    setClients(await clientResponse.json() as ClientRecord[]);
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData().catch((error: unknown) => {
        console.error(error);
        showNotice("Database unavailable — showing seed data");
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const visiblePackages = useMemo(() => packages.filter((item) =>
    `${item.name} ${item.resource} ${item.stack}`.toLowerCase().includes(packageSearch.toLowerCase()),
  ), [packages, packageSearch]);

  const visibleClients = useMemo(() => clients.filter((item) =>
    `${item.name} ${item.project} ${item.contact}`.toLowerCase().includes(clientSearch.toLowerCase()),
  ), [clients, clientSearch]);

  async function savePackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!packageForm.name || !packageForm.resource || !packageForm.stack) return;
    try {
      const id = editingPackageId ?? makeId("package");
      const response = await fetch(editingPackageId ? `/api/admin/packages/${id}` : "/api/admin/packages", {
        method: editingPackageId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...packageForm, id }),
      });
      if (!response.ok) throw new Error("Unable to save package.");
      const saved = await response.json() as PackageRecord;
      setPackages((current) => editingPackageId ? current.map((item) => item.id === id ? saved : item) : [...current, saved]);
      showNotice(editingPackageId ? "Package updated" : "Package added");
    } catch (error) {
      console.error(error);
      showNotice("Unable to save package");
    }
    setPackageForm(emptyPackage);
    setEditingPackageId(null);
  }

  async function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientForm.name || !clientForm.project || !clientForm.contact) return;
    try {
      const id = editingClientId ?? makeId("client");
      const response = await fetch(editingClientId ? `/api/admin/clients/${id}` : "/api/admin/clients", {
        method: editingClientId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...clientForm, id }),
      });
      if (!response.ok) throw new Error("Unable to save client.");
      const saved = await response.json() as ClientRecord;
      setClients((current) => editingClientId ? current.map((item) => item.id === id ? saved : item) : [...current, saved]);
      showNotice(editingClientId ? "Client updated" : "Client added");
    } catch (error) {
      console.error(error);
      showNotice("Unable to save client");
    }
    setClientForm(emptyClient);
    setEditingClientId(null);
  }

  function editPackage(item: PackageRecord) {
    setEditingPackageId(item.id);
    setPackageForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editClient(item: ClientRecord) {
    setEditingClientId(item.id);
    setClientForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removePackage(id: string) {
    if (!window.confirm("Remove this package?")) return;
    const response = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    if (!response.ok) {
      showNotice("Unable to remove package");
      return;
    }
    setPackages((current) => current.filter((item) => item.id !== id));
    showNotice("Package removed");
  }

  async function removeClient(id: string) {
    if (!window.confirm("Remove this client?")) return;
    const response = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
    if (!response.ok) {
      showNotice("Unable to remove client");
      return;
    }
    setClients((current) => current.filter((item) => item.id !== id));
    showNotice("Client removed");
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand admin-brand" href="/" aria-label="Back to Sendiko home">
          <span className="brand-mark">SSH</span>
          <span className="brand-name">Sendiko Service Hosting</span>
        </Link>
        <div className="admin-user">
          <span className="admin-avatar">S</span>
          <span><strong>{adminSeed.name}</strong><small>{adminSeed.email}</small></span>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {(["overview", "packages", "clients"] as Section[]).map((item) => (
            <Link key={item} className={section === item ? "active" : ""} href={`/admin/${item}`}>
              <span>{item === "overview" ? "▦" : item === "packages" ? "◈" : "◎"}</span>{item}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <span className="live-dot" /> local workspace
          <button onClick={() => void loadData()}>refresh database</button>
          <button onClick={() => { void fetch("/api/admin/logout", { method: "POST" }).then(() => router.push("/admin/login")); }}>sign out</button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-header">
          <div><p className="eyebrow">workspace / {section}</p><h1>{section === "overview" ? "Good morning, Sendiko." : `Manage ${section}.`}</h1></div>
          <Link className="admin-preview-link" href="/">view public site ↗</Link>
        </header>
        {notice && <div className="admin-notice" role="status">{notice}</div>}

        {section === "overview" && (
          <div className="admin-overview">
            <div className="admin-stat-grid">
              <div className="admin-stat"><span>active packages</span><strong>{packages.filter((item) => item.active).length}</strong><small>across {new Set(packages.map((item) => item.name)).size} services</small></div>
              <div className="admin-stat"><span>monthly from</span><strong>Rp 50K</strong><small>current entry price</small></div>
              <div className="admin-stat"><span>clients</span><strong>{clients.length}</strong><small>{clients.length ? "managed records" : "ready for your first client"}</small></div>
            </div>
            <div className="admin-panel admin-quick-panel">
              <div className="admin-panel-heading"><div><p className="eyebrow">quick actions</p><h2>Keep the catalog current.</h2></div><span className="admin-panel-icon">↗</span></div>
              <p>Packages here power your pricing catalog. Add the client after a project is confirmed so the dashboard becomes your small operating system.</p>
              <div className="admin-quick-actions"><Link className="admin-primary-button" href="/admin/packages">manage packages <span>↗</span></Link><Link className="admin-secondary-button" href="/admin/clients">add a client <span>+</span></Link></div>
            </div>
            <div className="admin-panel">
              <div className="admin-panel-heading"><div><p className="eyebrow">catalog snapshot</p><h2>Current service mix</h2></div><Link className="admin-text-button" href="/admin/packages">see all ↗</Link></div>
              <div className="snapshot-list">{["JavaScript API", "Laravel API", "JavaScript Website", "Laravel Website"].map((name) => <div key={name}><span>{name}</span><b>{packages.filter((item) => item.name === name && item.active).length} tiers</b><i /></div>)}</div>
            </div>
          </div>
        )}

        {section === "packages" && <div className="admin-management">
          <div className="admin-panel admin-form-panel"><div className="admin-panel-heading"><div><p className="eyebrow">{editingPackageId ? "edit package" : "new package"}</p><h2>{editingPackageId ? "Update a tier." : "Add a pricing tier."}</h2></div></div>
            <form className="admin-form" onSubmit={savePackage}>
              <label>service name<input value={packageForm.name} onChange={(event) => setPackageForm({ ...packageForm, name: event.target.value })} placeholder="JavaScript API" /></label>
              <label>category<select value={packageForm.category} onChange={(event) => setPackageForm({ ...packageForm, category: event.target.value as PackageForm["category"] })}><option>API</option><option>Website</option></select></label>
              <label>stack<input value={packageForm.stack} onChange={(event) => setPackageForm({ ...packageForm, stack: event.target.value })} placeholder="Node.js / Next.js" /></label>
              <label>resource tier<input value={packageForm.resource} onChange={(event) => setPackageForm({ ...packageForm, resource: event.target.value })} placeholder="512MB RAM / 1GB storage" /></label>
              <label>setup price (K)<input type="number" min="0" value={packageForm.setupPrice} onChange={(event) => setPackageForm({ ...packageForm, setupPrice: Number(event.target.value) })} /></label>
              <label>monthly price (K)<input type="number" min="0" value={packageForm.monthlyPrice} onChange={(event) => setPackageForm({ ...packageForm, monthlyPrice: Number(event.target.value) })} /></label>
              <label className="admin-checkbox"><input type="checkbox" checked={packageForm.active} onChange={(event) => setPackageForm({ ...packageForm, active: event.target.checked })} /> visible on public site</label>
              <div className="admin-form-actions"><button className="admin-primary-button" type="submit">{editingPackageId ? "save changes" : "add package"} <span>↗</span></button>{editingPackageId && <button className="admin-secondary-button" type="button" onClick={() => { setEditingPackageId(null); setPackageForm(emptyPackage); }}>cancel</button>}</div>
            </form>
          </div>
          <div className="admin-panel admin-table-panel"><div className="admin-panel-heading"><div><p className="eyebrow">package catalog / {packages.length}</p><h2>All packages</h2></div><input className="admin-search" value={packageSearch} onChange={(event) => setPackageSearch(event.target.value)} placeholder="search packages..." /></div>
            <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>service</th><th>resource</th><th>setup</th><th>monthly</th><th>status</th><th /></tr></thead><tbody>{visiblePackages.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.stack}</small></td><td>{item.resource}</td><td>{formatPrice(item.setupPrice)}</td><td className="admin-price">{formatPrice(item.monthlyPrice)}</td><td><span className={`admin-status ${item.active ? "active" : "paused"}`}>{item.active ? "active" : "hidden"}</span></td><td className="admin-row-actions"><button onClick={() => editPackage(item)}>edit</button><button onClick={() => removePackage(item.id)}>remove</button></td></tr>)}</tbody></table></div>
          </div>
        </div>}

        {section === "clients" && <div className="admin-management">
          <div className="admin-panel admin-form-panel"><div className="admin-panel-heading"><div><p className="eyebrow">{editingClientId ? "edit client" : "new client"}</p><h2>{editingClientId ? "Update a client." : "Add a client."}</h2></div></div>
            <form className="admin-form" onSubmit={saveClient}>
              <label>client name<input value={clientForm.name} onChange={(event) => setClientForm({ ...clientForm, name: event.target.value })} placeholder="Client or team name" /></label>
              <label>project<input value={clientForm.project} onChange={(event) => setClientForm({ ...clientForm, project: event.target.value })} placeholder="Project name" /></label>
              <label>package<select value={clientForm.packageId} onChange={(event) => setClientForm({ ...clientForm, packageId: event.target.value })}><option value="">Select a package</option>{packages.map((item) => <option key={item.id} value={item.id}>{item.name} / {item.resource}</option>)}</select></label>
              <label>contact<input value={clientForm.contact} onChange={(event) => setClientForm({ ...clientForm, contact: event.target.value })} placeholder="WhatsApp or email" /></label>
              <label>status<select value={clientForm.status} onChange={(event) => setClientForm({ ...clientForm, status: event.target.value as ClientForm["status"] })}><option>Lead</option><option>Active</option><option>Paused</option></select></label>
              <div className="admin-form-actions"><button className="admin-primary-button" type="submit">{editingClientId ? "save changes" : "add client"} <span>↗</span></button>{editingClientId && <button className="admin-secondary-button" type="button" onClick={() => { setEditingClientId(null); setClientForm(emptyClient); }}>cancel</button>}</div>
            </form>
          </div>
          <div className="admin-panel admin-table-panel"><div className="admin-panel-heading"><div><p className="eyebrow">client list / {clients.length}</p><h2>Project clients</h2></div><input className="admin-search" value={clientSearch} onChange={(event) => setClientSearch(event.target.value)} placeholder="search clients..." /></div>
            {visibleClients.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>client</th><th>project</th><th>package</th><th>contact</th><th>status</th><th /></tr></thead><tbody>{visibleClients.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.project}</td><td>{packages.find((packageItem) => packageItem.id === item.packageId)?.name ?? "Unassigned"}</td><td>{item.contact}</td><td><span className={`admin-status ${item.status.toLowerCase()}`}>{item.status}</span></td><td className="admin-row-actions"><button onClick={() => editClient(item)}>edit</button><button onClick={() => removeClient(item.id)}>remove</button></td></tr>)}</tbody></table></div> : <div className="admin-empty"><span>◎</span><h3>No client records yet.</h3><p>Add a client when a project is confirmed. Your seeded catalog is ready above.</p></div>}
          </div>
        </div>}
      </section>
    </main>
  );
}
