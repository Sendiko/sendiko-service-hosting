import { NextResponse } from "next/server";
import { getCustomerSessionId } from "../../../lib/customer-auth";
import { createOrder, findCustomerById } from "../../../lib/customer-service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    project?: string;
    packageId?: string;
    durationMonths?: number;
    notes?: string;
  };

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  // Check if visitor has an active customer session
  const customerId = await getCustomerSessionId();
  let customer = null;
  if (customerId) {
    customer = await findCustomerById(customerId);
  }

  // If customer is registered and logged in, use their account details if not explicitly overridden
  const customerName = (customer ? customer.name : body.name)?.trim();
  const customerEmail = (customer ? customer.email : body.email)?.trim().toLowerCase();

  if (!customerName || customerName.length < 2) {
    return NextResponse.json({ error: "Please provide a valid full name (at least 2 characters)." }, { status: 400 });
  }

  if (!customerEmail || !EMAIL_REGEX.test(customerEmail)) {
    return NextResponse.json({ error: "Please provide a valid contact email address." }, { status: 400 });
  }

  const projectName = body.project?.trim();
  if (!projectName || projectName.length < 2) {
    return NextResponse.json({ error: "Please provide your project or assignment name." }, { status: 400 });
  }

  const packageId = body.packageId;
  if (!packageId) {
    return NextResponse.json({ error: "Please select a hosting package." }, { status: 400 });
  }

  const duration = Number(body.durationMonths) || 1;
  if (![1, 3, 6, 12].includes(duration)) {
    return NextResponse.json({ error: "Duration must be 1, 3, 6, or 12 months." }, { status: 400 });
  }

  try {
    const result = await createOrder({
      name: customerName,
      email: customerEmail,
      project: projectName,
      packageId,
      durationMonths: duration,
      notes: body.notes,
      customerId: customer?.id,
    });

    return NextResponse.json({
      ok: true,
      order: result.order,
      package: result.package,
      paymentDetails: {
        method: "Bank Transfer",
        bankName: "Bank Jago",
        bankCode: "542",
        accountNumber: "1029-3849-5821",
        accountHolder: "Muhammad Sendiko",
        totalAmount: result.order.totalAmount,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Order processing error:", error);
    return NextResponse.json({ error: "Failed to process your order. Please try again." }, { status: 500 });
  }
}
