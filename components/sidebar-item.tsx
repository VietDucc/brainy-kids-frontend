"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

type SidebarItemProps = {
  label: string;
  iconSrc: string;
  href: string;
  disabled?: boolean;
};

export const SidebarItem = ({
  label,
  iconSrc,
  href,
  disabled = false,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/");
  const locale = segments[1];

  const pathWithoutLocale = "/" + segments.slice(2).join("/");

  const isActive = (() => {
    if (href === "/") {
      return pathWithoutLocale === "/" || pathWithoutLocale === "";
    }

    if (pathWithoutLocale === href) {
      return true;
    }

    if (pathWithoutLocale.startsWith(href + "/")) {
      return true;
    }

    return false;
  })();

  const fullHref = locale ? `/${locale}${href}` : href;

  const handleClick = () => {
    if (disabled) {
      router.push(`/${locale}/premium`);
    }
  };

  if (disabled) {
    return (
      <Button
        variant="sidebar"
        className="h-[52px] justify-start opacity-60 hover:opacity-80 cursor-pointer relative group"
        onClick={handleClick}
      >
        <div className="flex items-center w-full">
          <Image
            src={iconSrc}
            alt={label}
            className="mr-5 opacity-50"
            height={32}
            width={32}
          />
          <span className="flex-1">{label}</span>
          <Lock className="h-4 w-4 text-gray-500" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-yellow-100/20 group-hover:to-yellow-100/40 transition-all duration-200 rounded-md" />
      </Button>
    );
  }

  return (
    <Button
      variant={isActive ? "sidebarOutline" : "sidebar"}
      className="h-[52px] justify-start"
      asChild
    >
      <Link href={fullHref}>
        <Image
          src={iconSrc}
          alt={label}
          className="mr-5"
          height={32}
          width={32}
        />
        {label}
      </Link>
    </Button>
  );
};
