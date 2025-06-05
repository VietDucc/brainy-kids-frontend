"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  RotateCcw,
  ArrowLeft,
  Star,
  Brain,
  Sparkles,
  Loader2,
  Keyboard,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VocabWord {
  id: number;
  eng: string;
  vie: string;
  note?: string;
}

interface VocabClientProps {
  vocabularyData: VocabWord[];
}

export function VocabClient({ vocabularyData }: VocabClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState("flashcard");
  const [displayMode, setDisplayMode] = useState<"flashcard" | "full">(
    "flashcard"
  );
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % vocabularyData.length);
    setIsFlipped(false);
  }, [vocabularyData.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + vocabularyData.length) % vocabularyData.length
    );
    setIsFlipped(false);
  }, [vocabularyData.length]);

  const flipCard = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const speakWord = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (activeTab !== "flashcard" || loadingAction !== null) return;

      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return;
      }

      switch (event.key) {
        case " ": // Space key
        case "Spacebar": // For older browsers
          event.preventDefault();
          event.stopPropagation();
          // Only flip if in flashcard mode
          if (displayMode === "flashcard") {
            flipCard();
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          event.stopPropagation();
          goToPrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          event.stopPropagation();
          goToNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [activeTab, displayMode, loadingAction, flipCard, goToPrevious, goToNext]);

  const handleTabChange = (value: string) => {
    setLoadingAction(value);

    setActiveTab(value);
    setLoadingAction(null);
  };

  const handleDisplayModeChange = (mode: "flashcard" | "full") => {
    setLoadingAction(mode);

    setDisplayMode(mode);
    setLoadingAction(null);
  };

  if (vocabularyData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
        <div className="text-2xl font-bold text-gray-600 mb-4">
          Không có từ vựng cho bài học này
        </div>
        <Button onClick={() => router.back()} variant="outline">
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[url('/images/kids-pattern.png')] dark:bg-gray-900 flex flex-col relative p-4 md:p-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 animate-float-slow">
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float">
          <Star className="w-6 h-6 text-pink-400" />
        </div>
        <div className="absolute top-1/3 right-20 animate-float-slow">
          <BookOpen className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Learn
          </Button>

          {/* Keyboard shortcuts hint */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full backdrop-blur">
            <Keyboard className="w-3 h-3" />
            <span>Space: Flip</span>
            <span>←→: Navigate</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-gradient">
            Học Từ Vựng Vui Vẻ
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Let&apos;s learn new words together! 🌟
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="flashcard"
        className="flex-1 flex flex-col"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <div className="flex justify-center mb-6">
          <TabsList className="h-14 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg w-full max-w-md grid grid-cols-2 gap-2 p-2">
            <TabsTrigger
              value="flashcard"
              className="h-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group font-medium"
              disabled={loadingAction !== null}
            >
              {loadingAction === "flashcard" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">📚 Thẻ Từ Vựng</span>
                </>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="h-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:via-teal-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group font-medium"
              disabled={loadingAction !== null}
            >
              {loadingAction === "overview" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">🧠 Tổng Quan</span>
                </>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {activeTab === "flashcard" ? (
          <div className="flex-1 flex flex-col items-center h-full">
            <div className="flex items-center gap-3 text-sm mb-4">
              <div className="flex gap-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-md">
                <Button
                  size="sm"
                  variant={displayMode === "flashcard" ? "default" : "ghost"}
                  onClick={() => handleDisplayModeChange("flashcard")}
                  className="rounded-md px-4 py-2 text-sm font-medium transition-all duration-300"
                  disabled={loadingAction !== null}
                >
                  {loadingAction === "flashcard" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Loading...
                    </>
                  ) : (
                    "🃏 FlashCard"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant={displayMode === "full" ? "default" : "ghost"}
                  onClick={() => handleDisplayModeChange("full")}
                  className="rounded-md px-4 py-2 text-sm font-medium transition-all duration-300"
                  disabled={loadingAction !== null}
                >
                  {loadingAction === "full" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Loading...
                    </>
                  ) : (
                    "📖 Xem đầy đủ"
                  )}
                </Button>
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md font-bold text-sm">
                  {currentIndex + 1} / {vocabularyData.length}
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-lg px-4 flex items-center mt-4">
              {displayMode === "flashcard" ? (
                <div
                  className={`relative preserve-3d cursor-pointer transition-transform duration-700 w-full ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                  onClick={flipCard}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Mặt trước của FlCard */}
                  <div
                    className="w-full h-[300px] p-8 rounded-3xl shadow-xl bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-blue-800 dark:to-gray-800 border-4 border-blue-200 dark:border-blue-500 flex flex-col items-center justify-center backface-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-4 animate-bounce-slow">
                      {vocabularyData[currentIndex]?.eng || "Không có từ"}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mb-4 hover:bg-blue-100 dark:hover:bg-blue-800 group"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(vocabularyData[currentIndex]?.eng || "");
                      }}
                    >
                      <Volume2 className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                    </Button>
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center gap-2 mt-4">
                      <RotateCcw className="h-4 w-4 animate-spin-slow" /> Click
                      hoặc Space để xem nghĩa
                    </div>
                  </div>

                  {/* Mặt sau của FlCard */}
                  <div
                    className="w-full h-[300px] p-8 rounded-3xl shadow-xl bg-gradient-to-br from-purple-100 via-pink-50 to-white dark:from-purple-900 dark:via-purple-800 dark:to-gray-800 border-4 border-purple-200 dark:border-purple-500 flex flex-col items-center justify-center backface-hidden rotate-y-180 absolute top-0 left-0"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4 text-center animate-bounce-slow">
                      {vocabularyData[currentIndex]?.vie || "Không có từ"}
                    </div>
                    <div className="mt-2 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-xl text-gray-700 dark:text-gray-300 italic w-full max-w-md">
                      <span className="font-medium">Ghi chú:</span>{" "}
                      {vocabularyData[currentIndex]?.note || "Không có ghi chú"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center gap-2 mt-4">
                      <RotateCcw className="h-4 w-4 animate-spin-slow" /> Click
                      hoặc Space để xem từ tiếng Anh
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[300px] p-8 rounded-3xl shadow-xl bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-blue-800 dark:to-gray-800 border-4 border-blue-200 dark:border-blue-500 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-300 animate-bounce-slow">
                      {vocabularyData[currentIndex]?.eng || "Không có từ"}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-blue-100 dark:hover:bg-blue-800 group"
                      onClick={() =>
                        speakWord(vocabularyData[currentIndex]?.eng || "")
                      }
                    >
                      <Volume2 className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform" />
                    </Button>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4">
                    {vocabularyData[currentIndex]?.vie || "Không có từ"}
                  </div>
                  <div className="flex-1 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur rounded-xl text-gray-700 dark:text-gray-300 italic">
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {vocabularyData[currentIndex]?.note || "Không có ghi chú"}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="flex justify-center items-center gap-8">
                <Button
                  onClick={goToPrevious}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 group relative"
                  title="Previous (← Arrow Key)"
                >
                  <ChevronLeft className="h-8 w-8 group-hover:animate-bounce-x" />
                  <span className="absolute -bottom-8 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ←
                  </span>
                </Button>

                <Button
                  onClick={goToNext}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 group relative"
                  title="Next (→ Arrow Key)"
                >
                  <ChevronRight className="h-8 w-8 group-hover:animate-bounce-x" />
                  <span className="absolute -bottom-8 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </Button>
              </div>

              <div className="md:hidden text-xs text-center text-muted-foreground bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-full backdrop-blur">
                💡 Sử dụng phím: <strong>Space</strong> để lật thẻ,{" "}
                <strong>←→</strong> để điều hướng
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full pb-8">
            {/* Header for overview */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Tất cả từ vựng ({vocabularyData.length} từ)
                </h2>
              </div>
              <div className="text-sm text-muted-foreground">
                📚 Cuộn xuống để xem thêm
              </div>
            </div>

            {/* Scrollable vocabulary grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {vocabularyData.map((word, index) => (
                <Card
                  key={word.id || index}
                  className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-500 bg-white/90 dark:bg-gray-800/90 overflow-hidden rounded-2xl transform hover:-translate-y-1"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-300">
                        {word?.eng || "Không có từ"}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100 dark:hover:bg-blue-800 opacity-0 group-hover:opacity-100 transition-all group"
                        onClick={() => speakWord(word?.eng || "")}
                      >
                        <Volume2 className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                      </Button>
                    </div>

                    <div className="text-lg font-medium text-purple-600 dark:text-purple-300 mb-3">
                      {word?.vie || "Không có từ"}
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50/80 dark:bg-gray-900/80 p-3 rounded-xl backdrop-blur">
                      <span className="font-medium">Ghi chú:</span>{" "}
                      {word?.note || "Không có ghi chú"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Footer info */}
            <div className="text-center py-4 text-sm text-muted-foreground border-t border-gray-200 dark:border-gray-700">
              🎉 Bạn đã xem hết {vocabularyData.length} từ vựng!
            </div>
          </div>
        )}
      </Tabs>

      <style jsx global>{`
        .perspective {
          perspective: 2000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes bounce-x {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(3px);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-bounce-x {
          animation: bounce-x 1s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s linear infinite;
        }
        .group-hover\:animate-bounce-x:hover {
          animation: bounce-x 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
