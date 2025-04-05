"use client";

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: {
    results: { transcript: string; confidence: number }[][];
  }) => void;
  onerror: (event: { error: string }) => void;
  maxAlternatives: number;
}

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  Volume2,
  SkipForward,
  CheckCircle2,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { toast as sonnerToast } from "sonner";
import { Category } from "@/app/(main)/games/listen-n-speak/data";

interface Props {
  category: Category;
  onBack: () => void;
}

const levenshteinDistance = (str1: string, str2: string): number => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  return track[str2.length][str1.length];
};

export function SpeakAndFeedback({ category, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spokenText, setSpokenText] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [result, setResult] = useState<null | "success" | "error">(null);
  const [isListening, setIsListening] = useState(false);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentWord = category.words[currentIndex];
  const progress = (completedWords.size / category.words.length) * 100;

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (voice) => voice.lang.startsWith("en") && voice.localService
      );
      setSelectedVoice(englishVoice || voices[0]);
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    correctAudioRef.current = new Audio("/correct.wav");
    incorrectAudioRef.current = new Audio("/incorrect.wav");
    if (correctAudioRef.current) {
      correctAudioRef.current.volume = 0.8;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.maxAlternatives = 5;

        recognitionRef.current.onresult = (event) => {
          const results = event.results[0];
          const rawTranscript = results[0].transcript.trim();
          setSpokenText(rawTranscript);

          const alternatives = Array.from(results).map((result) => ({
            transcript: result.transcript.trim(),
            confidence: result.confidence,
          }));

          const normalizeString = (str: string) =>
            str
              .toLowerCase()
              .replace(/[.,!?]/g, "")
              .replace(/\s+/g, "")
              .trim();

          const targetWord = normalizeString(currentWord.text);

          const bestMatch = alternatives.some((alt) => {
            const normalizedTranscript = normalizeString(alt.transcript);

            if (normalizedTranscript === targetWord) {
              return true;
            }

            const maxAllowedDistance = Math.floor(targetWord.length * 0.2);
            const distance = levenshteinDistance(
              normalizedTranscript,
              targetWord
            );

            return distance <= maxAllowedDistance && alt.confidence > 0.8;
          });

          if (bestMatch) {
            setResult("success");
            setShowConfetti(true);
            setCompletedWords((prev) => new Set([...prev, currentIndex]));
            correctAudioRef.current?.play();
            setTimeout(() => setShowConfetti(false), 3000);
          } else {
            setResult("error");
            incorrectAudioRef.current?.play();
          }

          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          sonnerToast.error("We couldn't hear you. Please try again.");
        };
      } else {
        sonnerToast.error(
          "Speech recognition is not supported in this browser."
        );
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentWord.text]);

  const startListening = () => {
    setResult(null);
    setSpokenText("");
    setIsListening(!isListening);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Speech recognition error", error);
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current.start();
        }, 100);
      }
    }
  };

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(currentWord.text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (result === "success") {
      setCompletedWords((prev) => new Set([...prev, currentIndex]));
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= category.words.length) {
      setShowSummary(true);
      return;
    }
    setCurrentIndex(nextIndex);
    setResult(null);
    setSpokenText("");
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = () => {
    setShowSummary(true);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium">
            {completedWords.size} / {category.words.length}
          </span>
        </div>
      </div>

      <Card className="flex-1 shadow-lg border bg-card">
        <CardContent className="p-6 flex flex-col h-full">
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
            />
          )}

          <div className="flex-1 flex flex-col items-center justify-between min-h-[500px] w-full max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="w-full">
              <Progress value={progress} className="h-2" />
            </div>

            {showSummary ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <Trophy className="w-24 h-24 mx-auto text-yellow-500 mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Practice Complete!
                </h2>
                <p className="text-muted-foreground mb-6">
                  You completed {completedWords.size} out of{" "}
                  {category.words.length} words
                </p>
                <Progress value={progress} className="mb-6 h-2" />
                <div className="grid gap-4">
                  <Button
                    onClick={() => {
                      setCurrentIndex(0);
                      setCompletedWords(new Set());
                      setShowSummary(false);
                    }}
                  >
                    Practice Again
                  </Button>
                  <Button variant="outline" onClick={onBack}>
                    Choose Another Category
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Main content */}
                <div className="flex-1 flex flex-col items-center justify-center w-full space-y-8 py-8">
                  <div className="text-center">
                    <h2 className="text-xl font-medium text-muted-foreground mb-2">
                      Say this word:
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                      <motion.div
                        className="text-4xl font-bold text-primary"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {currentWord.text}
                      </motion.div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={speakWord}
                        className="rounded-full"
                        aria-label="Listen to pronunciation"
                      >
                        <Volume2 className="h-6 w-6 text-primary" />
                      </Button>
                    </div>
                    {currentWord.translation && (
                      <p className="text-muted-foreground text-sm mt-2">
                        {currentWord.translation}
                      </p>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Difficulty:{" "}
                      <span className="font-medium">
                        {currentWord.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Feedback area */}
                  <AnimatePresence mode="wait">
                    {result && (
                      <motion.div
                        key={result}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full text-center"
                      >
                        {result === "success" ? (
                          <div className="text-success space-y-2">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: [0, 1.2, 1] }}
                              className="text-4xl mb-2"
                            >
                              ✅
                            </motion.div>
                            <p className="font-medium">Great job!</p>
                            <Button
                              size="sm"
                              onClick={handleNext}
                              className="mt-2"
                            >
                              Next Word
                            </Button>
                          </div>
                        ) : (
                          <div className="text-warning space-y-2">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: [0, 1.2, 1] }}
                              className="text-4xl mb-2"
                            >
                              ❌
                            </motion.div>
                            <p className="font-medium">Let&apos;s try again!</p>
                            <p className="text-sm opacity-90">
                              We heard: &quot;{spokenText}&quot;
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="w-full space-y-4 py-8">
                  <Button
                    onClick={startListening}
                    variant={isListening ? "destructive" : "default"}
                    className="w-full h-16 text-lg rounded-full transition-all"
                  >
                    <Mic
                      className={`h-6 w-6 mr-2 ${
                        isListening ? "animate-pulse" : ""
                      }`}
                    />
                    {isListening ? "Listening..." : "Tap to Speak"}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleSkip}
                    >
                      <SkipForward className="h-5 w-5 mr-2" />
                      Skip
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleSubmit}
                    >
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
