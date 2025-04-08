"use client";

import { useState } from "react";
import { SpeakAndFeedback } from "@/components/speak-and-feedback";
import { categories } from "./data";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ListenNSpeak() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  if (selectedCategory) {
    const category = categories.find((c) => c.id === selectedCategory);
    if (!category) return null;

    return (
      <main className="min-h-screen p-4 md:p-8 bg-background">
        <div className="max-w-3xl mx-auto">
          <SpeakAndFeedback
            category={category}
            onBack={() => setSelectedCategory(null)}
          />
        </div>
      </main>
    );
  }

  return (
    <div className="h-full p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="space-y-2">
        <div className="text-center mb-8 sm:mb-12">
          <Link href="/games">
            <span className="flex items-center gap-x-2 text-muted-foreground text-sm sm:text-base">
              <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              Back to Games
            </span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2 sm:mb-4">
            English Pronunciation Game
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Choose a category to start practicing your pronunciation!
          </p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={item}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`p-4 sm:p-6 cursor-pointer bg-gradient-to-br ${category.color} hover:shadow-lg transition-all duration-300 h-[180px] sm:h-[220px] lg:h-[250px]`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4">
                {category.icon}
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 text-white">
                {category.title}
              </h2>
              <p className="text-sm sm:text-base text-white/90 line-clamp-2 sm:line-clamp-3">
                {category.description}
              </p>
              <div className="mt-2 sm:mt-4 flex items-center">
                <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full text-white">
                  {category.words.length} words
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
