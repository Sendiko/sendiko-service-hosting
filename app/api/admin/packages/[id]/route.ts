import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.package.update({
    where: { id },
    data: {
      name: body.name,
      category: body.category,
      stack: body.stack,
      resource: body.resource,
      setupPrice: Number(body.setupPrice),
      monthlyPrice: Number(body.monthlyPrice),
      active: Boolean(body.active),
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.package.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
