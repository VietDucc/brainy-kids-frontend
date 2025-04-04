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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
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
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/games">
            <span className="flex items-center gap-x-2 text-muted-foreground">
              <ArrowLeft className="h-6 w-6" />
              Back to Games
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-primary mb-4">
            English Pronunciation Game
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a category to start practicing your pronunciation!
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-6 cursor-pointer bg-gradient-to-br ${category.color} hover:shadow-lg transition-all duration-300 h-[250px]`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h2 className="text-2xl font-bold mb-2 text-white">
                  {category.title}
                </h2>
                <p className="text-white/90">{category.description}</p>
                <div className="mt-4 flex items-center text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white">
                    {category.words.length} words
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
