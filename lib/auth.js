import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

/**
 * Sign a JWT token
 */
export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET)
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch {
    return null
  }
}

/**
 * Get current user from cookies (server-side)
 * @param {import('next/headers').ReadonlyRequestCookies} cookies
 */
export async function getCurrentUser(cookies) {
  const token = cookies.get('resqid_token')?.value
  if (!token) return null
  return verifyToken(token)
}
