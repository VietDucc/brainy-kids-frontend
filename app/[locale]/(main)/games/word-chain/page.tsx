"use client";
import { Button } from "@/components/ui/button";
import WordChainGame from "@/components/word-chain-game";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const onBack = () => {
    router.back();
  };
  return (
    <main className="flex min-h-screen flex-col">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground flex justify-start w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Games
      </Button>
      <WordChainGame />
    </main>
  );
}
