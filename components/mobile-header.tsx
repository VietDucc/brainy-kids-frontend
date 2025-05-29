"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { useTranslation } from "react-i18next";

export const MobileHeader = () => {
  const { t } = useTranslation("main");

  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 lg:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 border-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
