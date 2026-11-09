export type PackageRecord = {
  id: string;
  name: string;
  category: "API" | "Website";
  stack: string;
  resource: string;
  setupPrice: number;
  monthlyPrice: number;
  active: boolean;
};

export type ClientRecord = {
  id: string;
  name: string;
  project: string;
  packageId: string;
  status: "Active" | "Paused" | "Lead";
  contact: string;
};

export type BillingRecord = {
  id: string;
  clientId: string;
  date: string;
  amount: number;
  paymentMethod: "Bank transfer" | "Cash" | "E-wallet" | "Credit card";
};

export const adminSeed = {
  id: "admin-sendiko",
  name: "Sendiko Admin",
  email: "admin@sendiko.local",
  role: "owner",
};

export const packageSeed: PackageRecord[] = [
  ...(["JavaScript API", "JavaScript Website"] as const).flatMap((name) =>
    ["512MB RAM / 1GB storage", "1GB RAM / 2GB storage", "2GB RAM / 4GB storage"].map((resource, index) => ({
      id: `${name.toLowerCase().replaceAll(" ", "-")}-${index + 1}`,
      name,
      category: name.endsWith("API") ? "API" as const : "Website" as const,
      stack: name.startsWith("JavaScript") ? "Node.js / Next.js" : "Laravel",
      resource,
      setupPrice: 50,
      monthlyPrice: [50, 100, 150][index],
      active: true,
    })),
  ),
  ...(["Laravel API", "Laravel Website"] as const).flatMap((name) =>
    ["512MB RAM / 1GB storage", "1GB RAM / 2GB storage", "2GB RAM / 4GB storage"].map((resource, index) => ({
      id: `${name.toLowerCase().replaceAll(" ", "-")}-${index + 1}`,
      name,
      category: name.endsWith("API") ? "API" as const : "Website" as const,
      stack: "PHP / Laravel",
      resource,
      setupPrice: 65,
      monthlyPrice: [50, 100, 150][index],
      active: true,
    })),
  ),
];

export const clientSeed: ClientRecord[] = [];
