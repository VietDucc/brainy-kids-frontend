"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { i18nConfig } from "@/lib/i18n";
import Image from "next/image";

const languages = [
  { code: "vi", name: "Tiếng Việt", flag: "/vietnam-flag.svg" },
  { code: "en", name: "English", flag: "/uk-flag.svg" },
];

export const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale =
    segments[0] in
    languages.reduce((acc, lang) => ({ ...acc, [lang.code]: true }), {})
      ? segments[0]
      : i18nConfig.defaultLocale;

  useEffect(() => {
    const savedLocale = Cookies.get("NEXT_LOCALE");
    if (!savedLocale) {
      Cookies.set("NEXT_LOCALE", currentLocale || "vi");
    }
  }, [currentLocale]);

  const handleLanguageChange = (locale: string) => {
    Cookies.set("NEXT_LOCALE", locale);

    if (pathname === "/") {
      router.push(`/${locale}`);
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    const isCurrentPathLocalized =
      segments[0] in
      languages.reduce((acc, lang) => ({ ...acc, [lang.code]: true }), {});

    const pathWithoutLocale = isCurrentPathLocalized
      ? segments.slice(1).join("/")
      : segments.join("/");

    router.push(`/${locale}/${pathWithoutLocale}`);
  };

  const savedLocale = Cookies.get("NEXT_LOCALE");
  const currentLanguage =
    languages.find((lang) => lang.code === (savedLocale || currentLocale)) ||
    languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative"
          title={currentLanguage.name}
        >
          <Image
            src={currentLanguage.flag}
            alt={currentLanguage.name}
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image
              src={language.flag}
              alt={language.name}
              width={24}
              height={24}
              className="rounded-sm"
            />
            <span>{language.name}</span>
            {currentLanguage.code === language.code && (
              <span className="ml-auto text-xs text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
