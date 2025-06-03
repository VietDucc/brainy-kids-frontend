"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Mic, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const GamesPage = () => {
  const { t } = useTranslation("games");

  const games = [
    {
      id: "pronunciation",
      title: t("games.pronunciation.title"),
      description: t("games.pronunciation.description"),
      icon: Mic,
      href: "/games/listen-n-speak",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      comingSoon: false,
    },
    {
      id: "word_chain",
      title: t("games.word_chain.title"),
      description: t("games.word_chain.description"),
      icon: LinkIcon,
      href: "/games/word-chain",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500",
      comingSoon: false,
    },
  ];

  return (
    <div className="h-full p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t("header.title")}</h1>
        <p className="text-muted-foreground">{t("header.description")}</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {games.map((game) => (
          <motion.div key={game.id} variants={item}>
            <Link href={game.href}>
              <Card className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300">
                <div className="p-6 space-y-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center text-white",
                      game.color
                    )}
                  >
                    <game.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {game.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {game.description}
                    </p>
                  </div>
                  {game.comingSoon && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-muted px-2 py-1 rounded-full text-xs">
                        {t("labels.coming_soon")}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default GamesPage;
