"use client";

import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { BookOpen, Loader } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { ModeToggle } from "./mode-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { ButtonPayment } from "./button-payment";

type SidebarProps = {
  className?: string;
  activeUser?: boolean;
};

export const Sidebar = ({ className, activeUser = false }: SidebarProps) => {
  const { t } = useTranslation("main");

  const navigationItems = [
    { label: "navigation.learn", href: "/learn", iconSrc: "/learn.svg" },
    {
      label: "navigation.leaderboard",
      href: "/leaderboard",
      iconSrc: "/leaderboard.svg",
    },
    { label: "navigation.blog", href: "/blog", iconSrc: "/blog.png" },
    {
      label: "navigation.flashcards",
      href: "/flashcards",
      iconSrc: "/flashcard.png",
    },
    {
      label: "navigation.dictionary",
      href: "/dictionary",
      iconSrc: "/dictionary.svg",
    },
    {
      label: "navigation.games",
      href: "/games",
      iconSrc: "/game.png",
      disabled: !activeUser,
    },
    { label: "navigation.videos", href: "/videos", iconSrc: "/video.svg" },
    {
      label: "navigation.speakbooks",
      href: "/audio-book",
      iconSrc: "/book.png",
      disabled: !activeUser,
    },
    {
      label: "navigation.test",
      href: "/test",
      iconSrc: "/test.png",
    },
  ];

  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]",
        className
      )}
    >
      <Link href="/learn">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8 flex-shrink-0">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-extrabold tracking-wide">
            Kids<span className="text-primary font-light">Learn</span>
          </h1>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-y-2 overflow-y-auto min-h-0">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.href}
            label={t(item.label)}
            href={item.href}
            iconSrc={item.iconSrc}
            disabled={item.disabled}
          />
        ))}
      </div>

      <div className="flex-shrink-0">
        <div className="py-4 flex justify-center">
          <ButtonPayment activeUser={activeUser} />
        </div>
        <div className="py-4">
          <ClerkLoading>
            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
          </ClerkLoading>

          <ClerkLoaded>
            <div className="flex justify-between items-center gap-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonPopoverCard: { pointerEvents: "initial" },
                  },
                }}
              />
              <LanguageSwitcher />

              <ModeToggle />
            </div>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};
