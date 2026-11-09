import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/auth";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const body = await request.json();
  const item = await prisma.client.create({
    data: {
      id: body.id,
      name: body.name,
      project: body.project,
      packageId: body.packageId || null,
      status: body.status,
      contact: body.contact,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
