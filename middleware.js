import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { MODULE_PLAN_MAP } from './lib/constants'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(req) {
  const token = req.cookies.get('resqid_token')?.value
  const pathname = req.nextUrl.pathname

  // Public routes — skip auth check
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Verify JWT
  let payload = null
  try {
    const result = await jwtVerify(token, SECRET)
    payload = result.payload
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Role-based route protection
  if (pathname.startsWith('/superadmin') && payload.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/school', req.url))
  }

  if (pathname.startsWith('/school') && payload.role !== 'school_admin') {
    return NextResponse.redirect(new URL('/superadmin', req.url))
  }

  // Plan-based module protection
  for (const [route, allowedPlans] of Object.entries(MODULE_PLAN_MAP)) {
    if (pathname.startsWith(route) && !allowedPlans.includes(payload.plan)) {
      return NextResponse.redirect(new URL('/school/upgrade', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
