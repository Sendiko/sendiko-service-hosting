import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const packages = await prisma.package.findMany({ orderBy: [{ name: "asc" }, { monthlyPrice: "asc" }] });
  return NextResponse.json(packages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const item = await prisma.package.create({
    data: {
      id: body.id,
      name: body.name,
      category: body.category,
      stack: body.stack,
      resource: body.resource,
      setupPrice: Number(body.setupPrice),
      monthlyPrice: Number(body.monthlyPrice),
      active: Boolean(body.active),
    },
  });
  return NextResponse.json(item, { status: 201 });
}
