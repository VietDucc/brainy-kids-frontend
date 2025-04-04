"use client";

import { useState } from "react";
import {
  Search,
  Loader2,
  Volume2,
  ArrowRight,
  Languages,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: {
    name: string;
    url: string;
  };
}

interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
}

interface TranslationResponse {
  translatedText: string;
  alternatives: string[];
}

const MotionCard = motion(Card);
const MotionBadge = motion(Badge);

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [translation, setTranslation] = useState<TranslationResponse | null>(
    null
  );
  const [isTranslating, setIsTranslating] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const floatVariants = {
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        yoyo: Infinity,
      },
    },
  };

  const combineMeanings = (entry: DictionaryEntry) => {
    const combined = entry.meanings.reduce((acc, curr) => {
      const existing = acc.find((m) => m.partOfSpeech === curr.partOfSpeech);
      if (existing) {
        existing.definitions = [...existing.definitions, ...curr.definitions];
        existing.synonyms = [
          ...new Set([...existing.synonyms, ...curr.synonyms]),
        ];
        existing.antonyms = [
          ...new Set([...existing.antonyms, ...curr.antonyms]),
        ];
      } else {
        acc.push({ ...curr });
      }
      return acc;
    }, [] as Meaning[]);

    return { ...entry, meanings: combined };
  };

  const searchWord = async (word: string) => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError(null);
    setTranslation(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          word.trim()
        )}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError(`Từ không tìm thấy "${word}"`);
        } else {
          setError(`Lỗi: ${response.status}`);
        }
        setEntries([]);
        return;
      }

      const data = await response.json();
      const combinedData = data.map(combineMeanings);
      setEntries(combinedData);

      setRecentSearches((prev) => {
        const newSearches = [
          word.toLowerCase(),
          ...prev.filter((s) => s.toLowerCase() !== word.toLowerCase()),
        ];
        return newSearches.slice(0, 5);
      });

      translateWord(word);
    } catch (err) {
      console.error("Error fetching dictionary data:", err);
      setError("Failed to fetch dictionary data. Please try again.");
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const translateWord = async (word: string) => {
    setIsTranslating(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        body: JSON.stringify({
          text: word,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Translation API error: ${res.status}`);
      }

      const translationData = await res.json();
      setTranslation(translationData);
    } catch (err) {
      console.error("Error translating word:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSearch = () => {
    searchWord(searchTerm);
  };

  const handleRecentSearch = (word: string) => {
    setSearchTerm(word);
    searchWord(word);
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  };

  const findAudio = (phonetics: Phonetic[]) => {
    return phonetics.find((p) => p.audio && p.audio.trim() !== "");
  };

  return (
    <main className="min-h-screen">
      <motion.div
        className="container mx-auto px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-10" variants={itemVariants}>
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
              Từ Điển Thông Minh
            </h1>
            <motion.p
              className="text-muted-foreground"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Khám phá từ vựng mới cùng nhau!{" "}
              <Sparkles className="inline-block h-5 w-5 text-yellow-400" />
            </motion.p>
          </motion.div>

          {/* Search */}
          <motion.div className="relative mb-8" variants={itemVariants}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Nhập từ bạn muốn tìm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-12 rounded-full border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background/80 backdrop-blur-sm"
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !searchTerm.trim()}
                  className="h-12 px-6 rounded-full transition-all duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Tìm kiếm"
                  )}
                </Button>
              </motion.div>
            </div>

            {/* Recent searches */}
            <AnimatePresence>
              {recentSearches.length > 0 && (
                <motion.div
                  className="mt-3 flex flex-wrap gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="text-sm text-muted-foreground mr-1">
                    Tìm kiếm gần đây:
                  </span>
                  {recentSearches.map((word, index) => (
                    <MotionBadge
                      key={index}
                      variant="outline"
                      className="cursor-pointer bg-background/50 hover:bg-background backdrop-blur-sm transition-colors rounded-full px-4"
                      onClick={() => handleRecentSearch(word)}
                      whileHover={floatVariants.hover}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      {word}
                    </MotionBadge>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <MotionCard
                className="mb-8 border-destructive/20 bg-destructive/10 backdrop-blur-sm rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CardContent className="p-6 text-center">
                  <motion.p
                    className="text-destructive"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {error}
                  </motion.p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Hãy kiểm tra lại chính tả hoặc thử tìm một từ tương tự nhé!
                    🔍
                  </p>
                </CardContent>
              </MotionCard>
            )}
          </AnimatePresence>

          {/* Loading state */}
          {isLoading && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-10 w-1/3 rounded-full" />
                <Skeleton className="h-6 w-1/4 rounded-full" />
              </div>
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {!isLoading && entries.length > 0 && (
              <motion.div
                className="space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {entries.map((entry, entryIndex) => (
                  <motion.div
                    key={entryIndex}
                    className="space-y-6"
                    variants={itemVariants}
                  >
                    {/* Word header */}
                    <motion.div
                      className="flex items-center justify-between"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div>
                        <motion.h2
                          className="text-3xl font-bold text-primary"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {entry.word}
                        </motion.h2>
                        {(entry.phonetic ||
                          entry.phonetics.find((p) => p.text)?.text) && (
                          <motion.p
                            className="text-primary/80 text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {entry.phonetic ||
                              entry.phonetics.find((p) => p.text)?.text}
                          </motion.p>
                        )}
                      </div>

                      {/* Pronunciation */}
                      {findAudio(entry.phonetics) && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-12 w-12 bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 transition-colors"
                            onClick={() =>
                              playAudio(findAudio(entry.phonetics)?.audio || "")
                            }
                          >
                            <Volume2 className="h-5 w-5 text-primary" />
                            <span className="sr-only">Nghe phát âm</span>
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Translation */}
                    <AnimatePresence>
                      {(translation || isTranslating) && (
                        <MotionCard
                          className="bg-primary/5 border-2 border-primary/20 rounded-xl backdrop-blur-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Languages className="h-5 w-5 text-primary" />
                              <h3 className="font-medium text-foreground">
                                Nghĩa tiếng Việt
                              </h3>
                            </div>

                            {isTranslating ? (
                              <motion.div
                                className="flex items-center gap-2 text-muted-foreground"
                                animate={{ opacity: [0.5, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                              >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Đang dịch...</span>
                              </motion.div>
                            ) : translation ? (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <motion.p className="text-xl font-medium text-foreground mb-2">
                                  {translation.translatedText}
                                </motion.p>

                                {translation.alternatives &&
                                  translation.alternatives.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      <span className="text-sm text-muted-foreground">
                                        Các nghĩa khác:
                                      </span>
                                      {translation.alternatives.map(
                                        (alt, altIndex) => (
                                          <MotionBadge
                                            key={altIndex}
                                            variant="outline"
                                            className="bg-background/50 text-muted-foreground rounded-full"
                                          >
                                            {alt}
                                          </MotionBadge>
                                        )
                                      )}
                                    </div>
                                  )}
                              </motion.div>
                            ) : null}
                          </CardContent>
                        </MotionCard>
                      )}
                    </AnimatePresence>

                    {/* Meanings */}
                    <Tabs
                      defaultValue={entry.meanings[0]?.partOfSpeech || "noun"}
                      className="w-full"
                    >
                      <TabsList className="mb-6 w-full justify-start overflow-x-auto bg-background/50 backdrop-blur-sm rounded-full p-1">
                        {entry.meanings.map((meaning, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <TabsTrigger
                              value={meaning.partOfSpeech}
                              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                              {meaning.partOfSpeech}
                            </TabsTrigger>
                          </motion.div>
                        ))}
                      </TabsList>

                      {entry.meanings.map((meaning, meaningIndex) => (
                        <TabsContent
                          key={meaningIndex}
                          value={meaning.partOfSpeech}
                          className="space-y-6"
                        >
                          {/* Definitions */}
                          <motion.div
                            className="space-y-4"
                            variants={containerVariants}
                          >
                            <h3 className="text-xl font-semibold text-foreground flex items-center">
                              <span className="mr-2">Định nghĩa</span>
                              <div className="h-px flex-1 bg-border"></div>
                            </h3>

                            <div className="space-y-4">
                              {meaning.definitions.map((def, defIndex) => (
                                <motion.div
                                  key={defIndex}
                                  className="pl-4 border-l-2 border-primary/20 bg-background/50 backdrop-blur-sm rounded-r-xl p-4"
                                  variants={itemVariants}
                                >
                                  <p className="text-foreground">
                                    <span className="font-medium text-primary mr-2">
                                      {defIndex + 1}.
                                    </span>
                                    {def.definition}
                                  </p>

                                  {def.example && (
                                    <motion.p
                                      className="text-muted-foreground italic mt-2 pl-6"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ delay: 0.2 }}
                                    >
                                      &quot;{def.example}&quot;
                                    </motion.p>
                                  )}

                                  {/* Synonyms & Antonyms */}
                                  <div className="flex flex-wrap gap-4 mt-3 pl-6">
                                    {def.synonyms.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-muted-foreground mr-2">
                                          Từ đồng nghĩa:
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {def.synonyms.map((syn, synIndex) => (
                                            <MotionBadge
                                              key={synIndex}
                                              variant="secondary"
                                              className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer rounded-full"
                                              onClick={() =>
                                                handleRecentSearch(syn)
                                              }
                                              whileHover={floatVariants.hover}
                                            >
                                              {syn}
                                            </MotionBadge>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {def.antonyms.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-muted-foreground mr-2">
                                          Từ trái nghĩa:
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {def.antonyms.map((ant, antIndex) => (
                                            <MotionBadge
                                              key={antIndex}
                                              variant="secondary"
                                              className="bg-destructive/10 text-destructive hover:bg-destructive/20 cursor-pointer rounded-full"
                                              onClick={() =>
                                                handleRecentSearch(ant)
                                              }
                                              whileHover={floatVariants.hover}
                                            >
                                              {ant}
                                            </MotionBadge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          <AnimatePresence>
            {!isLoading && entries.length === 0 && !error && (
              <MotionCard
                className="border-2 border-dashed border-primary/20 bg-background/50 backdrop-blur-sm rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CardContent className="p-10 text-center">
                  <motion.div
                    className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Search className="h-8 w-8 text-primary" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-medium text-foreground mb-2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Hãy tìm một từ nào! 🔍
                  </motion.h3>
                  <p className="text-muted-foreground mb-6">
                    Gõ một từ vào ô tìm kiếm để xem định nghĩa, cách phát âm và
                    nghĩa tiếng Việt nhé! ✨
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["hello", "happy", "friend", "learn", "play"].map(
                      (word, index) => (
                        <motion.div
                          key={word}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            className="transition-all duration-300"
                            onClick={() => {
                              setSearchTerm(word);
                              searchWord(word);
                            }}
                          >
                            {word}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      )
                    )}
                  </div>
                </CardContent>
              </MotionCard>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
