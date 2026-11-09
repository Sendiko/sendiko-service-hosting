import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";

const paymentMethods = ["Bank transfer", "Cash", "E-wallet", "Credit card"] as const;

function billingData(body: Record<string, unknown>) {
  const date = typeof body.date === "string" ? new Date(`${body.date}T00:00:00.000Z`) : new Date(NaN);
  const amount = Number(body.amount);
  const paymentMethod = body.paymentMethod;
  if (!body.id || typeof body.id !== "string" || !body.clientId || typeof body.clientId !== "string" ||
      Number.isNaN(date.getTime()) || !Number.isInteger(amount) || amount < 0 ||
      typeof paymentMethod !== "string" || !paymentMethods.includes(paymentMethod as typeof paymentMethods[number])) {
    return null;
  }
  return { id: body.id, clientId: body.clientId, date, amount, paymentMethod };
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const items = await prisma.billing.findMany({
    include: { client: { select: { name: true } } },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await request.json() as Record<string, unknown>;
  const data = billingData(body);
  if (!data) return NextResponse.json({ error: "Invalid billing details." }, { status: 400 });
  const item = await prisma.billing.create({ data });
  return NextResponse.json(item, { status: 201 });
}
