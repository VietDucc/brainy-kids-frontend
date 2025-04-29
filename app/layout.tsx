import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClerkLoaded, { ClerkLoading, ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { Loader2 } from 'lucide-react';
import ChatbotPopup from '@/components/chatbot/Chatbotpopup';



const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KidsLearn - Nền tảng học tập tương tác cho trẻ em',
  description: 'Nền tảng học tập tương tác giúp trẻ phát triển ngôn ngữ, tư duy, toán học và lập trình một cách thú vị.',
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="vi" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkLoading>
              <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin" />
              </div>
            </ClerkLoading>
            {children}
              <ChatbotPopup/>
            
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}