import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.client.update({
    where: { id },
    data: {
      name: body.name,
      project: body.project,
      packageId: body.packageId || null,
      status: body.status,
      contact: body.contact,
    },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  await prisma.client.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
