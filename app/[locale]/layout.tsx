import type React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Locale } from "@/lib/types";
import { serverSideTranslation } from "@/lib/i18n/client";
import I18NProvider from "@/app/components/i18n/i18n-provider";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const domain =
    process.env.NEXT_PUBLIC_APP_URL || "https://brainykidslearn.id.vn";
  const currentPath = headersList.get("x-url") || "";
  const pathWithoutLocale = currentPath.replace(/^\/(vi|en)/, "");
  const canonicalUrl = `${domain}${pathWithoutLocale}`;

  return {
    metadataBase: new URL(domain),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${domain}/en${pathWithoutLocale}`,
        vi: `${domain}/vi${pathWithoutLocale}`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const ns = [
    "common",
    "home",
    "hero",
    "feature",
    "workflow",
    "feedback",
    "stat",
    "price",
    "cta",
    "footer",
    "main",
    "learn",
    "blog",
    "games",
    "payment",
    "audiobook",
  ];
  const { resources } = await serverSideTranslation(locale, ns);

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <I18NProvider locale={locale} namespaces={ns} resources={resources}>
          <Toaster />
          <ClerkProvider>{children}</ClerkProvider>
        </I18NProvider>
      </ThemeProvider>
    </>
  );
}
