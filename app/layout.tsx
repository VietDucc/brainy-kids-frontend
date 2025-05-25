import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "./metadata";
import Script from "next/script";
import { SchemaMarkup } from "./components/shared/SchemaMarkup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@brainykids",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="vi" suppressHydrationWarning>
        <meta
          name="google-site-verification"
          content="JpWFUnVRaLO5UX__Uu1dI7Fjw5l8w5qVLMLJwJwej-U"
        />
        <head>
          <meta
            name="google-site-verification"
            content="JpWFUnVRaLO5UX__Uu1dI7Fjw5l8w5qVLMLJwJwej-U"
          />
          <link rel="canonical" href={siteConfig.url} />

          {/* Google tag (gtag.js) */}
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-8QN6TXH5QG"
          ></Script>
          <Script id="google-analytics">
            {`
               window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-8QN6TXH5QG');
            `}
          </Script>

          {/* Schema Markup */}
          <SchemaMarkup type="Organization" />
          <SchemaMarkup type="WebSite" />
        </head>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <ClerkLoaded>{children}</ClerkLoaded>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
