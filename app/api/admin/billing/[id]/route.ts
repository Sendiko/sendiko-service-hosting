import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/auth";

type Params = { params: Promise<{ id: string }> };
const paymentMethods = ["Bank transfer", "Cash", "E-wallet", "Credit card"] as const;

function billingData(body: Record<string, unknown>) {
  const date = typeof body.date === "string" ? new Date(`${body.date}T00:00:00.000Z`) : new Date(NaN);
  const amount = Number(body.amount);
  if (!body.clientId || typeof body.clientId !== "string" || Number.isNaN(date.getTime()) ||
      !Number.isInteger(amount) || amount < 0 || typeof body.paymentMethod !== "string" ||
      !paymentMethods.includes(body.paymentMethod as typeof paymentMethods[number])) return null;
  return { clientId: body.clientId, date, amount, paymentMethod: body.paymentMethod };
}

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const data = billingData(await request.json() as Record<string, unknown>);
  if (!data) return NextResponse.json({ error: "Invalid billing details." }, { status: 400 });
  const item = await prisma.billing.update({ where: { id }, data, include: { client: { select: { name: true } } } });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  await prisma.billing.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
