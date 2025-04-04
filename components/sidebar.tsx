import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { BookOpen, Loader } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";
import { ModeToggle } from "./mode-toggle";

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]",
        className
      )}
    >
      <Link href="/learn">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-extrabold tracking-wide">
            Kids<span className="text-primary font-light">Learn</span>
          </h1>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-y-2">
        <SidebarItem label="Learn" href="/learn" iconSrc="/learn.svg" />
        <SidebarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItem label="Quests" href="/quests" iconSrc="/quests.svg" />
        <SidebarItem
          label="Dictionary"
          href="/dictionary"
          iconSrc="/dictionary.svg"
        />
        <SidebarItem label="Games" href="/games" iconSrc="/game.png" />
        <SidebarItem label="Videos" href="/videos" iconSrc="/video.png" />
      </div>

      <div className="py-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
        </ClerkLoading>

        <ClerkLoaded>
          <div className="flex justify-between items-center">
            <UserButton
              appearance={{
                elements: {
                  userButtonPopoverCard: { pointerEvents: "initial" },
                },
              }}
            />
            <ModeToggle />
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
};
