import { prisma } from "./prisma";
import { customerSeed, packageSeed, type CustomerRecord, type OrderRecord, type PackageRecord } from "./seed-data";

// In-memory fallback cache when PostgreSQL is not running locally in dev mode
const memoryStore = new Map<string, CustomerRecord>();
const memoryOrders = new Map<string, OrderRecord>();

for (const seed of customerSeed) {
  memoryStore.set(seed.id, { ...seed });
}

export type SafeCustomer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
};

function toSafeCustomer(customer: {
  id: string;
  name: string;
  email: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}): SafeCustomer {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    createdAt: customer.createdAt
      ? typeof customer.createdAt === "string"
        ? customer.createdAt
        : customer.createdAt.toISOString()
      : new Date().toISOString(),
    updatedAt: customer.updatedAt
      ? typeof customer.updatedAt === "string"
        ? customer.updatedAt
        : customer.updatedAt.toISOString()
      : undefined,
  };
}

export async function findCustomerByEmail(email: string): Promise<(CustomerRecord & { createdAt?: string }) | null> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const customer = await prisma.customer.findUnique({
      where: { email: normalizedEmail },
    });
    if (customer) {
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password: customer.password,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.warn("Prisma query failed, falling back to memory store:", error);
    for (const record of memoryStore.values()) {
      if (record.email.toLowerCase() === normalizedEmail) {
        return record;
      }
    }
    return null;
  }
}

export async function findCustomerById(id: string): Promise<(CustomerRecord & { createdAt?: string }) | null> {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (customer) {
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        password: customer.password,
        createdAt: customer.createdAt.toISOString(),
        updatedAt: customer.updatedAt.toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.warn("Prisma query failed, falling back to memory store:", error);
    return memoryStore.get(id) ?? null;
  }
}

export async function createCustomer(data: {
  name: string;
  email: string;
  password: string;
}): Promise<SafeCustomer> {
  const normalizedEmail = data.email.trim().toLowerCase();
  const id = `cust-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date();

  try {
    const created = await prisma.customer.create({
      data: {
        id,
        name: data.name.trim(),
        email: normalizedEmail,
        password: data.password,
      },
    });
    // Also update memoryStore so fallback remains in sync
    memoryStore.set(id, {
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    });
    return toSafeCustomer(created);
  } catch (error) {
    console.warn("Prisma create failed, saving to memory store:", error);
    const newRecord: CustomerRecord = {
      id,
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    memoryStore.set(id, newRecord);
    return toSafeCustomer(newRecord);
  }
}

export async function updateCustomer(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
  },
): Promise<SafeCustomer | null> {
  const updateData: { name?: string; email?: string; password?: string } = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.email !== undefined) updateData.email = data.email.trim().toLowerCase();
  if (data.password !== undefined) updateData.password = data.password;

  try {
    const updated = await prisma.customer.update({
      where: { id },
      data: updateData,
    });
    memoryStore.set(id, {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      password: updated.password,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
    return toSafeCustomer(updated);
  } catch (error) {
    console.warn("Prisma update failed, updating memory store:", error);
    const existing = memoryStore.get(id);
    if (!existing) return null;
    const updatedRecord: CustomerRecord = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    memoryStore.set(id, updatedRecord);
    return toSafeCustomer(updatedRecord);
  }
}

export async function getCustomerProjects(customerId: string, email: string) {
  try {
    const clients = await prisma.client.findMany({
      where: {
        OR: [
          { customerId },
          { contact: email.trim().toLowerCase() },
        ],
      },
      include: {
        package: true,
        billings: {
          orderBy: { date: "desc" },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return clients;
  } catch (error) {
    console.warn("Prisma client query failed:", error);
    return [];
  }
}

export async function getAllPackages(): Promise<PackageRecord[]> {
  try {
    const packages = await prisma.package.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { monthlyPrice: "asc" }],
    });
    if (packages.length > 0) return packages as unknown as PackageRecord[];
    return packageSeed;
  } catch {
    return packageSeed;
  }
}

export async function createOrder(data: {
  name: string;
  email: string;
  project: string;
  packageId: string;
  durationMonths: number;
  paymentMethod?: string;
  notes?: string;
  customerId?: string;
}) {
  const normalizedEmail = data.email.trim().toLowerCase();
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const clientId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const duration = [1, 3, 6, 12].includes(data.durationMonths) ? data.durationMonths : 1;
  const paymentMethod = data.paymentMethod || "Bank Transfer - Bank Jago (1029-3849-5821)";

  // Find package to calculate total
  const packages = await getAllPackages();
  const selectedPackage = packages.find((p) => p.id === data.packageId) || packages[0];
  const setupFee = selectedPackage.setupPrice * 1000;
  const monthlyFee = selectedPackage.monthlyPrice * 1000 * duration;
  const devopsFee = 25000; // 25K first month
  const totalAmount = setupFee + monthlyFee + devopsFee;

  try {
    // 1. Create client lead
    const client = await prisma.client.create({
      data: {
        id: clientId,
        name: data.name.trim(),
        project: data.project.trim(),
        contact: normalizedEmail,
        status: "Lead",
        packageId: selectedPackage.id,
        customerId: data.customerId || null,
      },
    });

    // 2. Create order
    const order = await prisma.order.create({
      data: {
        id: orderId,
        name: data.name.trim(),
        email: normalizedEmail,
        project: data.project.trim(),
        packageId: selectedPackage.id,
        durationMonths: duration,
        totalAmount,
        paymentMethod,
        status: "Pending",
        notes: data.notes?.trim() || null,
        customerId: data.customerId || null,
        clientId: client.id,
      },
      include: {
        package: true,
      },
    });

    return {
      order,
      package: selectedPackage,
      client,
    };
  } catch (error) {
    console.warn("Prisma order creation failed, saving to memory:", error);
    const orderRecord: OrderRecord = {
      id: orderId,
      name: data.name.trim(),
      email: normalizedEmail,
      project: data.project.trim(),
      packageId: selectedPackage.id,
      durationMonths: duration,
      totalAmount,
      paymentMethod,
      status: "Pending",
      notes: data.notes?.trim(),
      customerId: data.customerId,
      clientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryOrders.set(orderId, orderRecord);

    return {
      order: orderRecord,
      package: selectedPackage,
      client: {
        id: clientId,
        name: data.name.trim(),
        project: data.project.trim(),
        contact: normalizedEmail,
        status: "Lead",
      },
    };
  }
}

export async function getCustomerOrders(customerId: string, email: string) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { customerId },
          { email: email.trim().toLowerCase() },
        ],
      },
      include: {
        package: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return orders;
  } catch (error) {
    console.warn("Prisma order query failed, using memory:", error);
    const result = [];
    const normalizedEmail = email.trim().toLowerCase();
    for (const order of memoryOrders.values()) {
      if (order.customerId === customerId || order.email.toLowerCase() === normalizedEmail) {
        const pkg = packageSeed.find((p) => p.id === order.packageId) || null;
        result.push({ ...order, package: pkg });
      }
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
