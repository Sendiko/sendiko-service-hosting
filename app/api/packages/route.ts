import { NextResponse } from "next/server";
import { getAllPackages } from "../../../lib/customer-service";

export async function GET() {
  try {
    const packages = await getAllPackages();
    return NextResponse.json(packages);
  } catch (error) {
    console.error("Failed to load packages:", error);
    return NextResponse.json({ error: "Failed to load packages" }, { status: 500 });
  }
}
