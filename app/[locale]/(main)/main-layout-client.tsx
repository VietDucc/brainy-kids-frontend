import type { PropsWithChildren } from "react";
import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import ChatbotPopup from "@/components/chatbot/Chatbotpopup";

interface MainLayoutClientProps extends PropsWithChildren {
  activeUser: boolean;
  userId: string | null;
}

export function MainLayoutClient({
  children,
  activeUser,
  userId,
}: MainLayoutClientProps) {
  return (
    <>
      <MobileHeader activeUser={activeUser} />
      <Sidebar className="hidden lg:flex" activeUser={activeUser} />
      <main className="h-full lg:pl-[256px]">
        <div className="mx-auto h-full max-w-[1056px] pt-6">
          <Toaster />
          {userId && activeUser && <ChatbotPopup />}
          {children}
        </div>
      </main>
    </>
  );
}
