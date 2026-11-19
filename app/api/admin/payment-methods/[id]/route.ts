import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.paymentMethod.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      icon: body.icon || null,
      accountInfo: body.accountInfo || null,
      active: Boolean(body.active),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  await prisma.paymentMethod.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
