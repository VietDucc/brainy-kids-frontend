"use client";
import type { PropsWithChildren } from "react";

import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import ChatbotPopup from "@/components/chatbot/Chatbotpopup";
import { useAuth } from "@clerk/nextjs";

const MainLayout = ({ children }: PropsWithChildren) => {
  const { userId } = useAuth();
  // const { t } = useTranslation(["main"]);

  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:flex" />
      <main className="h-full lg:pl-[256px] ">
        <div className="mx-auto h-full max-w-[1056px] pt-6">
          <Toaster />
          {userId && <ChatbotPopup />}
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayout;
