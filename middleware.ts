import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { canAccessPath } from "@/lib/auth/permissions"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const pathname = request.nextUrl.pathname

  if (!token) {
    const url = new URL("/", request.url)
    url.searchParams.set("connexion", "requise")
    return NextResponse.redirect(url)
  }

  const role = typeof token.role === "string" ? token.role : "CLIENT"

  if (!canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/clients/:path*", "/entreprises/:path*", "/documents/:path*", "/rendez-vous/:path*", "/factures/:path*", "/base-connaissances/:path*", "/recrutement/admin/:path*"]
}
