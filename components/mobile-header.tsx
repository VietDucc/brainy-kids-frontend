"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

type MobileHeaderProps = {
  activeUser?: boolean;
};

export const MobileHeader = ({ activeUser = false }: MobileHeaderProps) => {
  // const { t } = useTranslation("main");

  return (
    <Sheet>
      <SheetTrigger className="p-2 transition hover:opacity-75 lg:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 border-0">
        <Sidebar activeUser={activeUser} />
      </SheetContent>
    </Sheet>
  );
};
