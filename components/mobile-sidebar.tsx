import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-white" />
      </SheetTrigger>

      <SheetContent className="z-[50] p-0" side="left">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
