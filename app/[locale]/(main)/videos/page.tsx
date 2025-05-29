"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VIDEOS } from "./data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["All", "Songs", "Educational", "Vocabulary"];
const DIFFICULTY_LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Count active filters
  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedDifficulty !== "All" ? 1 : 0);

  const filteredVideos = VIDEOS.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || video.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" || video.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
  };

  return (
    <main className="min-h-screen pb-10 px-8 md:px-0">
      <div className="max-w-7xl mx-auto space-y-10">
        <Card className="bg-background/80 backdrop-blur-sm border-border overflow-hidden">
          <CardContent className="p-4 md:p-6">
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} />
                {activeFilterCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {(activeFilterCount > 0 || searchTerm) && (
                <Button variant="ghost" size="icon" onClick={clearFilters}>
                  <X size={18} />
                </Button>
              )}
            </div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-5 border-t mt-5 space-y-5 border-border/30">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Categories
                        </h3>
                        {selectedCategory !== "All" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCategory("All")}
                            className="h-6 text-xs"
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => (
                          <Button
                            key={category}
                            variant={
                              selectedCategory === category
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className={cn(
                              "rounded-full text-xs transition-all"
                            )}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Difficulty Level
                        </h3>
                        {selectedDifficulty !== "All" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDifficulty("All")}
                            className="h-6 text-xs"
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {DIFFICULTY_LEVELS.map((level) => (
                          <Button
                            key={level}
                            variant={
                              selectedDifficulty === level
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedDifficulty(level)}
                            className={cn(
                              "rounded-full text-xs transition-all"
                            )}
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Video */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <motion.div key={video.id} variants={item}>
                <Link href={`/videos/${video.id}`} className="block">
                  <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-border bg-card">
                    <div className="relative aspect-video group">
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <PlayCircle className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md z-10">
                        {video.duration}
                      </div>
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4 bg-card">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-foreground">
                        {video.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center mt-3 justify-between">
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {video.category}
                        </span>
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {video.difficulty}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-muted-foreground"
              >
                No videos found matching your search criteria.
              </motion.div>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear filters
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
