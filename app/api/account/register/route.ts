import { NextResponse } from "next/server";
import { createCustomer, findCustomerByEmail } from "../../../../lib/customer-service";
import { createCustomerSession, hashPassword } from "../../../../lib/customer-auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json() as { name?: string; email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const { name, email, password } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Name must be at least 2 characters." }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const existing = await findCustomerByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  try {
    const hashedPassword = hashPassword(password);
    const customer = await createCustomer({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });

    await createCustomerSession(customer.id);
    return NextResponse.json({ ok: true, customer }, { status: 201 });
  } catch (error) {
    console.error("Error registering customer:", error);
    return NextResponse.json({ error: "Unable to create account. Please try again." }, { status: 500 });
  }
}
