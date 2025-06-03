"use client";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import ChatbotPopup from "@/components/chatbot/Chatbotpopup";
import { useAuth } from "@clerk/nextjs";

const MainLayout = ({ children }: PropsWithChildren) => {
  const { userId } = useAuth();
  const [activeUser, setActiveUser] = useState<boolean>(false);
  // const { t } = useTranslation(["main"]);

  useEffect(() => {
    const fetchActiveUser = async () => {
      try {
        const response = await fetch("/api/active-user", {
          method: "GET",
        });
        const data = await response.json();
        setActiveUser(data.active);
      } catch (error) {
        console.error("Error fetching active user:", error);
        setActiveUser(false);
      }
    };

    if (userId) {
      fetchActiveUser();
    }
  }, [userId]);

  return (
    <>
      <MobileHeader activeUser={activeUser} />
      <Sidebar className="hidden lg:flex" activeUser={activeUser} />
      <main className="h-full lg:pl-[256px] ">
        <div className="mx-auto h-full max-w-[1056px] pt-6">
          <Toaster />
          {userId && activeUser && <ChatbotPopup />}
          {children}
        </div>
      </main>
    </>
  );
};

export default MainLayout;
