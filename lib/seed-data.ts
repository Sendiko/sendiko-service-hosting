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
  paymentMethod: string;
};

export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderRecord = {
  id: string;
  name: string;
  email: string;
  project: string;
  packageId: string;
  durationMonths: number;
  totalAmount: number;
  paymentMethod: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  notes?: string;
  customerId?: string;
  clientId?: string;
  createdAt: string;
  updatedAt?: string;
};

export type PaymentMethodRecord = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  accountInfo?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const customerSeed: CustomerRecord[] = [
  {
    id: "cust-demo-1",
    name: "Ahmad Fauzi",
    email: "ahmad.fauzi@student.ac.id",
    // Password is 'password123'
    password: "90f0f420dc2b9cccf185571ceb26e5e6:448e497d0337381c761179816903403db6c3843f4aadfb16cf801fa8c3518b989352f279f45bf7c95b555f403c3f1c54a8b065be58bfd6c12bebb51e2d323ca2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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

export const paymentMethodSeed: PaymentMethodRecord[] = [
  {
    id: "pm-bank-jago",
    name: "Bank Transfer - Bank Jago",
    description: "Direct bank transfer via Bank Jago",
    icon: "🏦",
    accountInfo: "Bank Jago Account Details",
    active: true,
  },
  {
    id: "pm-bca",
    name: "Bank Transfer - BCA",
    description: "Direct bank transfer via BCA",
    icon: "🏦",
    accountInfo: "BCA Account Details",
    active: true,
  },
  {
    id: "pm-mandiri",
    name: "Bank Transfer - Mandiri",
    description: "Direct bank transfer via Mandiri",
    icon: "🏦",
    accountInfo: "Mandiri Account Details",
    active: true,
  },
  {
    id: "pm-gopay",
    name: "E-wallet - GoPay",
    description: "Payment via GoPay e-wallet",
    icon: "💳",
    accountInfo: "GoPay Account Details",
    active: true,
  },
  {
    id: "pm-ovo",
    name: "E-wallet - OVO",
    description: "Payment via OVO e-wallet",
    icon: "💳",
    accountInfo: "OVO Account Details",
    active: true,
  },
  {
    id: "pm-cash",
    name: "Cash Payment",
    description: "Direct cash payment",
    icon: "💰",
    active: true,
  },
];
