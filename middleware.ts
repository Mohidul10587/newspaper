import createMiddleware from "next-intl/middleware"
import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"

const intlMiddleware = createMiddleware({
  locales: ["en", "bn"],
  defaultLocale: "en",
  localePrefix: "always",
})

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if the route requires admin access
        if (req.nextUrl.pathname.includes("/admin")) {
          return token?.role === "admin" || token?.role === "editor"
        }
        return !!token
      },
    },
  },
)

export default function middleware(req: NextRequest) {
  // Apply auth middleware only to protected routes
  if (req.nextUrl.pathname.includes("/admin")) {
    return authMiddleware(req as any)
  }

  // Apply intl middleware to all other routes
  return intlMiddleware(req)
}

export const config = {
  matcher: ["/", "/(bn|en)/:path*"],
}
