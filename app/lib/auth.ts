import "~/config/env";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "react-router";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

const COOKIE_NAME = "session";

export interface SessionPayload {
  id: number;
  email: string;
  role: string;
}

export const signToken = async (payload: SessionPayload) => {
  const SECRET = getSecret();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(SECRET);
};

export const verifyToken = async (token: string): Promise<SessionPayload | null> => {
  try {
    const SECRET = getSecret();
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
};


// client side helper to get session data from cookie
const AUTH_COOKIE_NAME = "auth_token";

export function requireAuth(request: Request) {
  const cookie_header = request.headers.get("Cookie") ?? "";
  const token = parseCookie(cookie_header, AUTH_COOKIE_NAME);

  if (!token) {
    throw redirect("/auth/login");
  }

  return token;
}

function parseCookie(cookie_header: string, name: string): string | null {
  const match = cookie_header
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

