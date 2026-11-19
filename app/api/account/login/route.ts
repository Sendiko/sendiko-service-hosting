import { NextResponse } from "next/server";
import { findCustomerByEmail } from "../../../../lib/customer-service";
import { createCustomerSession, verifyPassword } from "../../../../lib/customer-auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json() as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const customer = await findCustomerByEmail(email);
    if (!customer || !verifyPassword(password, customer.password)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await createCustomerSession(customer.id);
    return NextResponse.json({
      ok: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        createdAt: customer.createdAt,
      },
    });
  } catch (error) {
    console.error("Error during customer login:", error);
    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
  }
}
