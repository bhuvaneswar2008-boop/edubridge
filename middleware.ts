import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow static files, next internal files, assets, and auth api endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/login'
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('edubridge_session')?.value

  // If no session token, redirect to /login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If visiting the root '/', redirect to '/dashboard'
  if (pathname === '/') {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
