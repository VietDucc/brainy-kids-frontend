"use client";

import { useState } from "react";
import {
  Search,
  Loader2,
  Volume2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Types for dictionary data
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

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchWord = async (word: string) => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          word.trim()
        )}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError(`No definitions found for "${word}"`);
        } else {
          setError(`Error: ${response.status}`);
        }
        setEntries([]);
        return;
      }

      const data = await response.json();
      setEntries(data);

      // Add to recent searches
      setRecentSearches((prev) => {
        const newSearches = [
          word.toLowerCase(),
          ...prev.filter((s) => s.toLowerCase() !== word.toLowerCase()),
        ];
        return newSearches.slice(0, 5); // Keep only the 5 most recent searches
      });
    } catch (err) {
      console.error("Error fetching dictionary data:", err);
      setError("Failed to fetch dictionary data. Please try again.");
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    searchWord(searchTerm);
  };

  const handleRecentSearch = (word: string) => {
    setSearchTerm(word);
    searchWord(word);
  };

  // Play audio pronunciation
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
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/80">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Modern Dictionary
            </h1>
            <p className="text-muted-foreground">
              Look up any word and expand your vocabulary
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for any word..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 h-12 rounded-lg"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchTerm.trim()}
                className="h-12 px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-1">
                  Recent:
                </span>
                {recentSearches.map((word, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleRecentSearch(word)}
                  >
                    {word}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {error && (
            <Card className="mb-8 border-destructive/50 bg-destructive/10">
              <CardContent className="p-6 text-center">
                <p className="text-destructive">{error}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try checking your spelling or searching for a similar word.
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {!isLoading && entries.length > 0 && (
            <div className="space-y-8">
              {entries.map((entry, entryIndex) => (
                <div key={entryIndex} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">
                        {entry.word}
                      </h2>
                      {entry.phonetic && (
                        <p className="text-primary text-lg">{entry.phonetic}</p>
                      )}
                    </div>

                    {findAudio(entry.phonetics) && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full h-12 w-12"
                        onClick={() =>
                          playAudio(findAudio(entry.phonetics)?.audio || "")
                        }
                      >
                        <Volume2 className="h-5 w-5 text-secondary" />
                        <span className="sr-only">Play pronunciation</span>
                      </Button>
                    )}
                  </div>

                  <Tabs
                    defaultValue={entry.meanings[0]?.partOfSpeech || "noun"}
                    className="w-full"
                  >
                    <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                      {entry.meanings.map((meaning, index) => (
                        <TabsTrigger
                          key={index}
                          value={meaning.partOfSpeech}
                          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                        >
                          {meaning.partOfSpeech}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {entry.meanings.map((meaning, meaningIndex) => (
                      <TabsContent
                        key={meaningIndex}
                        value={meaning.partOfSpeech}
                        className="space-y-6"
                      >
                        {/* Definitions */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-foreground flex items-center">
                            <span className="mr-2">Definitions</span>
                            <div className="h-px flex-1 bg-border"></div>
                          </h3>

                          <div className="space-y-4">
                            {meaning.definitions.map((def, defIndex) => (
                              <div
                                key={defIndex}
                                className="pl-4 border-l-2 border-primary/30"
                              >
                                <p className="text-foreground">
                                  <span className="font-medium text-primary mr-2">
                                    {defIndex + 1}.
                                  </span>
                                  {def.definition}
                                </p>

                                {def.example && (
                                  <p className="text-muted-foreground italic mt-2 pl-6">
                                    &quot;{def.example}&quot;
                                  </p>
                                )}

                                {/* Synonyms & Antonyms */}
                                <div className="flex flex-wrap gap-4 mt-3 pl-6">
                                  {def.synonyms.length > 0 && (
                                    <div>
                                      <span className="text-sm font-medium text-muted-foreground mr-2">
                                        Synonyms:
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {def.synonyms.map((syn, synIndex) => (
                                          <Badge
                                            key={synIndex}
                                            variant="secondary"
                                            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer"
                                            onClick={() =>
                                              handleRecentSearch(syn)
                                            }
                                          >
                                            {syn}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {def.antonyms.length > 0 && (
                                    <div>
                                      <span className="text-sm font-medium text-muted-foreground mr-2">
                                        Antonyms:
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {def.antonyms.map((ant, antIndex) => (
                                          <Badge
                                            key={antIndex}
                                            variant="secondary"
                                            className="bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                                            onClick={() =>
                                              handleRecentSearch(ant)
                                            }
                                          >
                                            {ant}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Source URLs */}
                        {entry.sourceUrls && entry.sourceUrls.length > 0 && (
                          <div className="pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                              Source:
                              {entry.sourceUrls.map((url, urlIndex) => (
                                <a
                                  key={urlIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center"
                                >
                                  {
                                    url
                                      .replace(/^https?:\/\//, "")
                                      .split("/")[0]
                                  }
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              ))}
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              ))}
            </div>
          )}

          {/* Empty state - show when no search has been performed yet */}
          {!isLoading && entries.length === 0 && !error && (
            <Card className="border-dashed border-2 bg-transparent">
              <CardContent className="p-10 text-center">
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">
                  Search for a word
                </h3>
                <p className="text-muted-foreground mb-6">
                  Type any word in the search box above to see its definition,
                  pronunciation, and more.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "hello",
                    "serendipity",
                    "ephemeral",
                    "ubiquitous",
                    "paradigm",
                  ].map((word) => (
                    <Button
                      key={word}
                      variant="outline"
                      className="border-primary/20 hover:bg-primary/10"
                      onClick={() => {
                        setSearchTerm(word);
                        searchWord(word);
                      }}
                    >
                      {word}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
