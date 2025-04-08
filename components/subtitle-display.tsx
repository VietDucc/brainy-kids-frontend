"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SubtitleDisplayProps {
  englishText: string;
  vietnameseText?: string;
  timeOffset?: number;
}

export default function SubtitleDisplay({
  englishText,
  vietnameseText = "",
  timeOffset = -1200,
}: SubtitleDisplayProps) {
  const [displayEnglishText, setDisplayEnglishText] = useState("");
  const [displayVietnameseText, setDisplayVietnameseText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Vietnamese subtitle delay in milliseconds (should be at least 200ms)
  const viDelay = 0;

  useEffect(() => {
    // Clear any existing timeout
    let timeoutIdEn: NodeJS.Timeout;
    let timeoutIdVi: NodeJS.Timeout;

    if (englishText) {
      // For English text
      if (timeOffset < 0) {
        // Show English immediately if offset is negative
        setDisplayEnglishText(englishText);
      } else {
        // Delay English text display if offset is positive
        timeoutIdEn = setTimeout(() => {
          setDisplayEnglishText(englishText);
        }, timeOffset);
      }

      // For Vietnamese text - always add the viDelay
      // If we have Vietnamese text from props, use it, otherwise use fallback message
      const viText = vietnameseText || "Chưa có bản dịch";

      // Calculate Vietnamese delay based on English offset
      const vietnameseDelay = Math.max(0, timeOffset) + viDelay;

      timeoutIdVi = setTimeout(() => {
        setDisplayVietnameseText(viText);
      }, vietnameseDelay);
    } else {
      // If no English text, clear both displays
      setDisplayEnglishText("");
      setDisplayVietnameseText("");
    }

    return () => {
      if (timeoutIdEn) clearTimeout(timeoutIdEn);
      if (timeoutIdVi) clearTimeout(timeoutIdVi);
    };
  }, [englishText, vietnameseText, timeOffset]);

  const speakText = (text: string) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={cn(
        "relative w-full transition-all duration-300",
        isHovered ? "shadow-lg" : "shadow-md"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-70"
        )}
      />

      <div className="p-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-3 px-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-purple-900 dark:text-purple-300 uppercase tracking-wider px-3 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-full">
              English
            </h3>
            {displayEnglishText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => speakText(displayEnglishText)}
                  className="h-7 w-7 p-0 rounded-full bg-purple-50 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/60"
                >
                  <Volume2 size={14} />
                </Button>
              </motion.div>
            )}
          </div>
          <div className="relative min-h-[60px] flex items-center justify-center px-3">
            <AnimatePresence mode="wait">
              {displayEnglishText ? (
                <motion.p
                  key={`en-${displayEnglishText}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl md:text-2xl font-medium text-center text-gray-800 dark:text-gray-100 leading-relaxed"
                >
                  {displayEnglishText}
                </motion.p>
              ) : (
                <p className="text-sm text-center text-gray-400 dark:text-gray-500 italic">
                  Waiting for subtitles...
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-3 border-t md:border-t-0 md:border-l border-purple-100/30 dark:border-purple-900/30 pt-5 md:pt-0 md:pl-8 px-1">
          <div className="flex items-center">
            <h3 className="text-xs font-medium text-teal-700 dark:text-teal-300 uppercase tracking-wider px-3 py-1 bg-teal-50 dark:bg-teal-900/30 rounded-full">
              Tiếng Việt
            </h3>
          </div>
          <div className="relative min-h-[60px] flex items-center justify-center px-3">
            <AnimatePresence mode="wait">
              {displayVietnameseText ? (
                <motion.p
                  key={`vi-${displayVietnameseText}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="text-xl md:text-2xl font-medium text-center text-gray-800 dark:text-gray-100 leading-relaxed"
                >
                  {displayVietnameseText}
                </motion.p>
              ) : (
                <p className="text-sm text-center text-gray-400 dark:text-gray-500 italic">
                  Đang chờ phụ đề...
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
