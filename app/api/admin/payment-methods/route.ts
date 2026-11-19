import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const paymentMethods = await prisma.paymentMethod.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] });
  return NextResponse.json(paymentMethods);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await request.json() as Record<string, unknown>;
  const item = await prisma.paymentMethod.create({
    data: {
      id: String(body.id),
      name: String(body.name),
      description: String(body.description),
      icon: typeof body.icon === "string" && body.icon ? body.icon : null,
      accountInfo: typeof body.accountInfo === "string" && body.accountInfo ? body.accountInfo : null,
      active: Boolean(body.active),
    },
  });
  return NextResponse.json(item, { status: 201 });
}
