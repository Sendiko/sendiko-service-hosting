import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { package: true, customer: true, client: true },
    });
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
