import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./lib/i18n";
import { NextResponse, NextRequest } from 'next/server';

// Create i18n middleware
const intlMiddleware = (req: NextRequest) => {
  return i18nRouter(req, i18nConfig);
};

// Define public routes - only home pages need to be public
const isPublicRoute = createRouteMatcher(['/', '/:locale'])

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Handle root path - redirect to locale from cookie or default
  if (pathname === '/') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || i18nConfig.defaultLocale;
    // For default locale (en), redirect to /en
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  // Skip i18n for API routes
  if (pathname.startsWith('/api/')) {
    if (!isPublicRoute(req)) {
      await auth.protect()
    }
    return;
  }

  // Protect all routes except public ones
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Run i18n middleware only for non-API routes
  return intlMiddleware(req)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}