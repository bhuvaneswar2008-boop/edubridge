import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './db'

const COOKIE_NAME = 'edubridge_session'
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'edubridge_fallback_secret_key_32chars_long_min!'
)

export interface SessionPayload {
  userId: string
  email: string
  role: string
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload)
  const cookieStore = cookies()
  // Use secure HTTPS cookies in production/Vercel; allow plain HTTP on local network testing
  const isSecure = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production' && process.env.LOCAL_DEV !== 'true'
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function removeSessionCookie() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return await verifySessionToken(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session?.userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  })

  return user
}
