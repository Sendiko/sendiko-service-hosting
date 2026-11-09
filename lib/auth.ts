import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "sendiko_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getAuthConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  if (!username || !password || !secret) {
    throw new Error("ADMIN_USERNAME, ADMIN_PASSWORD, and AUTH_SECRET must be configured.");
  }
  return { username, password, secret };
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function createSession(secret: string) {
  const payload = `${Date.now() + SESSION_TTL_SECONDS * 1000}`;
  return `${payload}.${sign(payload, secret)}`;
}

function isValidSession(value: string | undefined, secret: string) {
  if (!value) return false;
  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false;
  const expected = sign(expiresAt, secret);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export function verifyCredentials(username: string, password: string) {
  const config = getAuthConfig();
  return username === config.username && password === config.password;
}

export async function isAdminAuthenticated() {
  const config = getAuthConfig();
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(SESSION_COOKIE)?.value, config.secret);
}

export async function requireAdmin() {
  try {
    if (await isAdminAuthenticated()) return null;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
  }
  return NextResponse.json({ error: "Authentication required." }, { status: 401 });
}

export async function createAdminSession() {
  const { secret } = getAuthConfig();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSession(secret), {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
