import { NextResponse } from "next/server";
import {
  findCustomerByEmail,
  findCustomerById,
  getCustomerOrders,
  getCustomerProjects,
  updateCustomer,
} from "../../../lib/customer-service";
import {
  hashPassword,
  requireCustomer,
  verifyPassword,
} from "../../../lib/customer-auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const auth = await requireCustomer();
  if (auth instanceof NextResponse) return auth;

  const customer = await findCustomerById(auth.customerId);
  if (!customer) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  const [projects, orders] = await Promise.all([
    getCustomerProjects(customer.id, customer.email),
    getCustomerOrders(customer.id, customer.email),
  ]);

  return NextResponse.json({
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      createdAt: customer.createdAt,
    },
    projects,
    orders,
  });
}

export async function PATCH(request: Request) {
  const auth = await requireCustomer();
  if (auth instanceof NextResponse) return auth;

  const currentCustomer = await findCustomerById(auth.customerId);
  if (!currentCustomer) {
    return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  }

  let body: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  };
  try {
    body = await request.json() as {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const updatePayload: {
    name?: string;
    email?: string;
    password?: string;
  } = {};

  // Update Name
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
    }
    updatePayload.name = body.name.trim();
  }

  // Update Email
  if (body.email !== undefined) {
    const trimmedEmail = body.email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (trimmedEmail !== currentCustomer.email.toLowerCase()) {
      const existing = await findCustomerByEmail(trimmedEmail);
      if (existing && existing.id !== currentCustomer.id) {
        return NextResponse.json({ error: "This email address is already in use by another account." }, { status: 409 });
      }
      updatePayload.email = trimmedEmail;
    }
  }

  // Update Password
  if (body.newPassword !== undefined || body.currentPassword !== undefined) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: "Current password is required to change password." }, { status: 400 });
    }
    if (!verifyPassword(body.currentPassword, currentCustomer.password)) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }
    if (!body.newPassword || typeof body.newPassword !== "string" || body.newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters." }, { status: 400 });
    }
    updatePayload.password = hashPassword(body.newPassword);
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  try {
    const updated = await updateCustomer(currentCustomer.id, updatePayload);
    return NextResponse.json({ ok: true, customer: updated });
  } catch (error) {
    console.error("Error updating customer account:", error);
    return NextResponse.json({ error: "Failed to update account. Please try again." }, { status: 500 });
  }
}
