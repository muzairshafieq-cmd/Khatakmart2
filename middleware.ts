import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    // TEMPORARY FIX: Disabled Supabase Auth refresh in Middleware to avoid Netlify Edge Runtime errors.
    // This means sessions might not auto-refresh on the server, but the site will build and run.
    // return await updateSession(request)
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     */
        '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
