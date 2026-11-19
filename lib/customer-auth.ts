import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const CUSTOMER_SESSION_COOKIE = "sendiko_customer_session";
export const CUSTOMER_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return process.env.AUTH_SECRET || "sendiko-customer-auth-fallback-secret";
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;
    const keyBuffer = Buffer.from(hash, "hex");
    const derivedBuffer = scryptSync(password, salt, 64);
    return keyBuffer.length === derivedBuffer.length && timingSafeEqual(keyBuffer, derivedBuffer);
  } catch {
    return false;
  }
}

export function createCustomerSessionToken(customerId: string): string {
  const secret = getSecret();
  const expiresAt = Date.now() + CUSTOMER_SESSION_TTL_SECONDS * 1000;
  const payload = `${customerId}.${expiresAt}`;
  const signature = sign(payload, secret);
  return `${payload}.${signature}`;
}

export function verifyCustomerSessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [customerId, expiresAt, signature] = parts;
  if (!customerId || !expiresAt || !signature) return null;
  if (Number(expiresAt) < Date.now()) return null;

  const expected = sign(`${customerId}.${expiresAt}`, getSecret());
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (receivedBuffer.length !== expectedBuffer.length || !timingSafeEqual(receivedBuffer, expectedBuffer)) {
    return null;
  }
  return customerId;
}

export async function createCustomerSession(customerId: string): Promise<string> {
  const token = createCustomerSessionToken(customerId);
  try {
    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_SESSION_COOKIE, token, {
      httpOnly: true,
      maxAge: CUSTOMER_SESSION_TTL_SECONDS,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  } catch (err) {
    // Graceful handling when executed outside request scope (e.g., in unit tests)
    console.warn("Could not set cookie in request scope:", (err as Error).message);
  }
  return token;
}

export async function clearCustomerSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(CUSTOMER_SESSION_COOKIE);
  } catch (err) {
    console.warn("Could not delete cookie in request scope:", (err as Error).message);
  }
}

export async function getCustomerSessionId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
    return verifyCustomerSessionToken(token);
  } catch {
    return null;
  }
}

export async function requireCustomer(): Promise<{ customerId: string } | NextResponse> {
  const customerId = await getCustomerSessionId();
  if (!customerId) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  return { customerId };
}
