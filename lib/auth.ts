// jsonwebtoken does not provide TypeScript declarations in this project.
// @ts-expect-error Missing declaration file for jsonwebtoken.
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"
const TOKEN_EXPIRY = "7d"

export interface TokenPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getAuthCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("auth-token")?.value
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAuthCookie()
  if (!token) return null
  return verifyToken(token)
}
