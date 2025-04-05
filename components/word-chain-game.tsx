"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Star,
  Clock,
  RefreshCw,
  Heart,
  Lightbulb,
  Volume2,
  VolumeX,
  Trophy,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// List of common English words to use as starting words
const STARTER_WORDS = [
  "apple",
  "banana",
  "cat",
  "dog",
  "elephant",
  "fish",
  "game",
  "house",
  "ice",
  "jump",
  "kite",
  "lion",
  "monkey",
  "nest",
  "orange",
  "pencil",
  "queen",
  "rabbit",
  "sun",
  "tree",
  "umbrella",
  "van",
  "water",
  "xylophone",
  "yellow",
  "zebra",
];

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: { timePerTurn: 15, hintAllowed: true },
  medium: { timePerTurn: 10, hintAllowed: true },
  hard: { timePerTurn: 7, hintAllowed: false },
};

export default function WordChainGame() {
  const [currentWord, setCurrentWord] = useState("");
  const [inputWord, setInputWord] = useState("");
  const [wordChain, setWordChain] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [highScore, setHighScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audio files
    const loadAudio = async () => {
      try {
        if (typeof window !== "undefined") {
          correctAudioRef.current = new Audio("/correct.wav");
          wrongAudioRef.current = new Audio("/incorrect.wav");
          timerAudioRef.current = new Audio("/time-over.mp3");

          // Preload the audio files
          await Promise.all([
            correctAudioRef.current.load(),
            wrongAudioRef.current.load(),
            timerAudioRef.current.load(),
          ]);
        }
      } catch (error) {
        console.error("Error loading audio files:", error);
      }
    };

    loadAudio();

    return () => {
      if (correctAudioRef.current) correctAudioRef.current = null;
      if (wrongAudioRef.current) wrongAudioRef.current = null;
      if (timerAudioRef.current) timerAudioRef.current = null;
    };
  }, []);

  const playSound = async (type: "correct" | "wrong" | "timer") => {
    if (!soundEnabled) return;

    try {
      if (type === "correct" && correctAudioRef.current) {
        await correctAudioRef.current.play();
      } else if (type === "wrong" && wrongAudioRef.current) {
        await wrongAudioRef.current.play();
      } else if (type === "timer" && timerAudioRef.current) {
        await timerAudioRef.current.play();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const getRandomStarterWord = () => {
    return STARTER_WORDS[Math.floor(Math.random() * STARTER_WORDS.length)];
  };

  // Start the game
  const startGame = () => {
    const startWord = getRandomStarterWord();
    setWordChain([startWord]);
    setCurrentWord(startWord);
    setInputWord("");
    setMessage("");
    setIsError(false);
    setScore(0);
    setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timePerTurn);
    setIsPlaying(true);
    setGameOver(false);
    setShowHint(false);
    setHint("");
    setAchievements([]);
  };

  useEffect(() => {
    if (isPlaying && !gameOver && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isPlaying, gameOver, currentWord]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && !gameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isPlaying && !gameOver) {
      handleGameOver("Time's up! Game over.");
    }

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, gameOver, difficulty, soundEnabled]);

  // Handle game over
  const handleGameOver = (message: string) => {
    setIsPlaying(false);
    setGameOver(true);
    setMessage(message);
    setIsError(true);
    playSound("wrong");

    // Update high score if current score is higher
    if (score > highScore) {
      setHighScore(score);

      // Add achievement for new high score
      if (!achievements.includes("New High Score!")) {
        setAchievements((prev) => [...prev, "New High Score!"]);
      }
    }
  };

  // Check if the word is valid
  const checkWord = async (word: string) => {
    if (!word) return false;

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      setIsLoading(false);
      return response.ok;
    } catch (error) {
      setIsLoading(false);
      console.error("Error checking word:", error);
      return false;
    }
  };

  // Get a hint
  const getHint = async () => {
    if (!DIFFICULTY_SETTINGS[difficulty].hintAllowed || showHint) return;

    const lastLetter = currentWord.charAt(currentWord.length - 1);

    const commonWords: { [key: string]: string[] } = {
      a: ["apple", "ant", "animal", "amazing", "adventure"],
      b: ["ball", "boy", "book", "banana", "butterfly"],
      c: ["cat", "car", "cake", "candy", "computer"],
      d: ["dog", "door", "day", "duck", "dinosaur"],
      e: ["egg", "elephant", "eat", "eye", "earth"],
      f: ["fish", "fun", "food", "friend", "family"],
      g: ["game", "girl", "good", "green", "garden"],
      h: ["hat", "house", "happy", "hand", "heart"],
      i: ["ice", "island", "idea", "insect", "important"],
      j: ["jump", "juice", "job", "jacket", "jungle"],
      k: ["kite", "king", "kid", "kitchen", "kangaroo"],
      l: ["lion", "love", "light", "leaf", "lemon"],
      m: ["monkey", "moon", "mom", "music", "magic"],
      n: ["nest", "night", "nose", "name", "number"],
      o: ["orange", "ocean", "owl", "open", "office"],
      p: ["pencil", "pizza", "park", "purple", "planet"],
      q: ["queen", "quiet", "quick", "question", "quilt"],
      r: ["rabbit", "red", "rain", "river", "robot"],
      s: ["sun", "star", "school", "snake", "smile"],
      t: ["tree", "toy", "tiger", "time", "table"],
      u: ["umbrella", "up", "uncle", "under", "unicorn"],
      v: ["van", "voice", "very", "violet", "vacation"],
      w: ["water", "window", "world", "watch", "winter"],
      x: ["xylophone", "x-ray"],
      y: ["yellow", "yes", "year", "young", "yummy"],
      z: ["zebra", "zoo", "zero", "zigzag", "zone"],
    };

    const possibleWords = commonWords[lastLetter] || [];
    if (possibleWords.length > 0) {
      const randomWord =
        possibleWords[Math.floor(Math.random() * possibleWords.length)];
      setHint(randomWord);
      setShowHint(true);

      setScore((prev) => Math.max(0, prev - 2));
    } else {
      setHint("No hint available");
      setShowHint(true);
    }
  };

  const checkAchievements = (newScore: number, chainLength: number) => {
    const newAchievements = [...achievements];

    if (newScore >= 10 && !achievements.includes("Beginner")) {
      newAchievements.push("Beginner");
    }
    if (newScore >= 25 && !achievements.includes("Word Explorer")) {
      newAchievements.push("Word Explorer");
    }
    if (newScore >= 50 && !achievements.includes("Vocabulary Master")) {
      newAchievements.push("Vocabulary Master");
    }

    if (chainLength >= 5 && !achievements.includes("Chain Builder")) {
      newAchievements.push("Chain Builder");
    }
    if (chainLength >= 10 && !achievements.includes("Chain Master")) {
      newAchievements.push("Chain Master");
    }

    if (newAchievements.length > achievements.length) {
      setAchievements(newAchievements);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPlaying || gameOver) return;

    const trimmedWord = inputWord.trim().toLowerCase();

    const lastLetter = currentWord.charAt(currentWord.length - 1);

    if (!trimmedWord.startsWith(lastLetter)) {
      handleGameOver(`Word must start with the letter "${lastLetter}"!`);
      return;
    }

    if (wordChain.includes(trimmedWord)) {
      handleGameOver("You've already used this word!");
      return;
    }

    const isValid = await checkWord(trimmedWord);

    if (isValid) {
      setCurrentWord(trimmedWord);
      setWordChain([...wordChain, trimmedWord]);
      setInputWord("");
      setMessage("Correct! Keep going!");
      setIsError(false);

      const difficultyMultiplier =
        difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;
      const wordScore = Math.ceil(trimmedWord.length * difficultyMultiplier);
      const newScore = score + wordScore;

      setScore(newScore);

      setTimeLeft(DIFFICULTY_SETTINGS[difficulty].timePerTurn);

      setShowHint(false);
      setHint("");

      checkAchievements(newScore, wordChain.length + 1);

      playSound("correct");

      if (newScore > 0 && newScore % 25 === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      handleGameOver("That's not a valid English word!");
    }
  };

  const useHint = () => {
    if (hint && showHint) {
      setInputWord(hint);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-3 md:p-4">
      <Card className="border-2 border-primary/30 shadow-lg overflow-hidden bg-gradient-to-b from-background/95 to-background/90">
        <CardHeader className="p-3 md:p-4 bg-gradient-to-r from-primary/10 to-primary/5 space-y-1 pb-3 border-b-2 border-primary/20">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Word Chain Game
              </span>
              <span className="block text-xs md:text-sm font-normal text-muted-foreground mt-1">
                Connect words using the last letter of the previous word
              </span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8 rounded-full"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-primary" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-4 space-y-4">
          {!isPlaying && !gameOver ? (
            <div className="text-center space-y-4">
              <div className="bg-primary/5 rounded-lg p-3 md:p-4 border border-primary/10 shadow-sm">
                <h2 className="text-lg font-bold text-primary mb-2">
                  Ready to play?
                </h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll start with a random word. Continue the chain with
                  words that start with the last letter of the previous word.
                </p>
              </div>

              <div className="space-y-2 max-w-sm mx-auto p-3 bg-muted/20 rounded-lg">
                <h3 className="text-sm font-medium text-foreground flex items-center justify-center gap-1">
                  <span className="inline-block h-2 w-2 bg-primary rounded-full mr-1"></span>
                  Select Difficulty
                  <span className="inline-block h-2 w-2 bg-primary rounded-full ml-1"></span>
                </h3>
                <Select
                  value={difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") =>
                    setDifficulty(value)
                  }
                >
                  <SelectTrigger className="w-full bg-background/80 border-primary/20 text-sm h-9 rounded-md">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="easy"
                      className="text-emerald-500 font-medium"
                    >
                      Easy (15s per turn, hints allowed)
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className="text-amber-500 font-medium"
                    >
                      Medium (10s per turn, hints allowed)
                    </SelectItem>
                    <SelectItem
                      value="hard"
                      className="text-rose-500 font-medium"
                    >
                      Hard (7s per turn, no hints)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {highScore > 0 && (
                <div className="flex justify-center items-center gap-2 text-primary py-2 rounded-lg bg-primary/5 border border-primary/10">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <span className="text-base font-bold">
                    High Score: {highScore}
                  </span>
                </div>
              )}

              <Button
                onClick={startGame}
                className="text-base font-bold px-8 py-2 h-auto rounded-full transition-all hover:scale-105 mt-2"
              >
                Start Game
              </Button>
            </div>
          ) : gameOver ? (
            <div className="text-center space-y-4">
              <div className="space-y-2 animate-bounce-slow">
                <h2 className="text-xl font-bold text-destructive dark:text-red-500">
                  Game Over
                </h2>
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg space-y-2 border border-muted shadow-sm">
                <h3 className="text-base font-bold text-foreground flex items-center justify-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Final Score: {score}
                  <Star className="h-5 w-5 text-amber-500" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Words in chain:{" "}
                  <span className="font-medium">{wordChain.length}</span>
                </p>

                {highScore === score && score > 0 && (
                  <div className="mt-2 text-primary flex justify-center items-center gap-2 bg-primary/10 p-2 rounded-lg border border-primary/20 animate-pulse">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <span className="text-base font-bold">New High Score!</span>
                  </div>
                )}
              </div>

              {achievements.length > 0 && (
                <div className="p-3 bg-gradient-to-r from-primary/5 to-background rounded-lg border border-primary/10">
                  <h3 className="text-sm font-bold mb-2 text-foreground">
                    Achievements:
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {achievements.map((achievement, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="py-1 px-3 text-xs bg-primary/10 border border-primary/20"
                      >
                        <Trophy className="w-3 h-3 mr-2 text-amber-500" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={startGame}
                className="text-base font-bold px-8 py-2 h-auto rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 mt-4"
              >
                Play Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-md border border-primary/10 shadow-sm">
                  <Star className="text-amber-500 h-4 w-4" />
                  <span className="font-bold">Score: {score}</span>
                </div>
                <div className="flex items-center gap-2 justify-center bg-muted/20 p-2 rounded-md border border-primary/10 shadow-sm">
                  <Heart className="text-rose-500 h-4 w-4" />
                  <span className="font-bold">Lives: 1</span>
                </div>
                <div className="flex items-center gap-2 justify-end bg-muted/20 p-2 rounded-md border border-primary/10 shadow-sm">
                  <Clock
                    className={`h-4 w-4 ${
                      timeLeft <= 5
                        ? "text-rose-500 animate-pulse"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`font-bold ${
                      timeLeft <= 5 ? "text-rose-500" : ""
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="md:col-span-2 bg-primary/5 p-3 rounded-md space-y-2 border border-primary/20 shadow-sm">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    Current word:
                    <span className="ml-1 text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                      {currentWord}
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Next word must start with:{" "}
                    <span className="text-base font-bold text-primary inline-block px-3 py-1 bg-primary/10 rounded-md mt-1 border border-primary/20 shadow-sm animate-pulse-slow">
                      {currentWord.charAt(currentWord.length - 1)}
                    </span>
                  </p>
                </div>

                <div className="md:col-span-3 overflow-auto">
                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        type="text"
                        value={inputWord}
                        onChange={(e) => setInputWord(e.target.value)}
                        placeholder="Type your word..."
                        className="flex-1 h-10 text-sm border-primary/20 bg-background/80"
                        disabled={!isPlaying || isLoading || gameOver}
                      />
                      <Button
                        type="submit"
                        disabled={
                          !inputWord.trim() ||
                          !isPlaying ||
                          isLoading ||
                          gameOver
                        }
                        className="hover:bg-primary/90 h-10 w-10 p-0 rounded-full"
                      >
                        {isLoading ? (
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        ) : (
                          <Check className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </form>

                  {DIFFICULTY_SETTINGS[difficulty].hintAllowed && (
                    <div className="flex justify-between items-center mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={getHint}
                        disabled={showHint || !isPlaying || gameOver}
                        className="text-xs h-8 rounded-full"
                      >
                        <Lightbulb className="h-3 w-3 mr-1 text-amber-500" />
                        Get Hint (-2 pts)
                      </Button>

                      {showHint && hint && (
                        <div className="flex items-center gap-2 bg-background/80 p-2 rounded-md border border-primary/20">
                          <span className="text-xs text-muted-foreground">
                            Try:{" "}
                            <strong className="text-primary font-bold">
                              {hint}
                            </strong>
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={useHint}
                            className="h-6 text-xs p-0 px-2 text-primary hover:text-primary/80"
                          >
                            Use
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-muted/10 p-3 rounded-md border border-primary/10 shadow-sm">
                <h3 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-primary" />
                  Chain History:
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence>
                    {wordChain.map((word, index) => (
                      <motion.div
                        key={`${word}-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Badge
                          variant="secondary"
                          className="py-1 px-2 text-xs bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/20"
                        >
                          {word}
                          {index < wordChain.length - 1 && (
                            <ChevronRight className="ml-1 h-3 w-3 inline text-primary" />
                          )}
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-md border px-3 py-2 ${
                    isError
                      ? "bg-destructive/10 border-destructive/30 text-destructive dark:text-red-400"
                      : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400"
                  }`}
                >
                  <div className="flex items-center">
                    {isError ? (
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    ) : (
                      <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                    )}
                    <p className="text-xs font-medium">{message}</p>
                  </div>
                </div>
              )}

              {achievements.length > 0 && (
                <div className="bg-primary/5 p-2 rounded-md border border-primary/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="text-amber-500 h-3 w-3" />
                    <h3 className="text-xs font-bold">Recent Achievements:</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {achievements.slice(-3).map((achievement, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs py-0.5 px-2 border-primary/20 bg-background/60"
                      >
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const style = document.createElement("style");
style.textContent = `
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}
