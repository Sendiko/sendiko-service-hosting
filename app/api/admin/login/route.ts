import { NextResponse } from "next/server";
import { createAdminSession, verifyCredentials } from "../../../../lib/auth";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json() as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    if (!body.username || !body.password || !verifyCredentials(body.username, body.password)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  }
}
