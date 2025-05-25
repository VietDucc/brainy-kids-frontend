"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";

interface LeaderboardUser {
  id: number;
  clerkUserId: string;
  username: string;
  score: number;
  level?: number;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/leaderboard");

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();

        const validUsers = data.filter(
          (user: LeaderboardUser) =>
            user.username &&
            user.username !== "null null" &&
            user.username !== "string string"
        );

        const sortedData = [...validUsers].sort((a, b) => b.score - a.score);
        setLeaderboardData(sortedData);
      } catch (err) {
        console.error(err);
        setError(
          "Oops! We couldn't load the leaderboard. Please try again later!"
        );
        toast({
          title: "Error",
          description: "Failed to load leaderboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [toast]);

  const formatUsername = (username: string) => {
    if (!username) {
      return "Anonymous User";
    }

    const cleanName = username
      .split(" ")
      .filter((part) => part.toLowerCase() !== "null" && part !== "string")
      .join(" ");

    if (!cleanName.trim()) {
      return "Anonymous User";
    }

    if (/[\u00C0-\u1EF9]/.test(cleanName)) {
      return cleanName
        .split(" ")
        .map((word) => {
          if (word === word.toUpperCase()) return word;
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
    }

    return cleanName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getInitials = (username: string) => {
    const formattedName = formatUsername(username);
    if (formattedName === "Anonymous User") return "AU";

    const parts = formattedName.split(" ").filter((part) => part.length > 0);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return formattedName.substring(0, 2).toUpperCase();
  };

  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  if (isLoading) return <Loading text="leaderboard..." />;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
          </div>
        </div>

        <div className="relative bg-primary rounded-3xl p-12 mb-8">
          <div className="flex justify-around items-end">
            {topThree[1] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Avatar className="h-24 w-24 border-4 border-white mb-4">
                  <span className="text-xl font-bold">
                    {getInitials(topThree[1].username)}
                  </span>
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-semibold text-lg">
                    {formatUsername(topThree[1].username)}
                  </p>
                  <p className="text-primary-foreground/80">
                    Level {topThree[1].level || 3}
                  </p>
                </div>
                <div className="mt-4 text-6xl font-bold text-white">2</div>
              </motion.div>
            )}

            {/* First Place */}
            {topThree[0] && (
              <motion.div
                className="flex flex-col items-center -mt-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Avatar className="h-32 w-32 border-4 border-yellow-400 mb-4">
                  <span className="text-2xl font-bold">
                    {getInitials(topThree[0].username)}
                  </span>
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-bold text-xl">
                    {formatUsername(topThree[0].username)}
                  </p>
                  <p className="text-primary-foreground/80">
                    Level {topThree[0].level || 3}
                  </p>
                </div>
                <div className="mt-4 text-7xl font-bold text-white">1</div>
              </motion.div>
            )}

            {/* Third Place */}
            {topThree[2] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Avatar className="h-24 w-24 border-4 border-white mb-4">
                  <span className="text-xl font-bold">
                    {getInitials(topThree[2].username)}
                  </span>
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-semibold text-lg">
                    {formatUsername(topThree[2].username)}
                  </p>
                  <p className="text-primary-foreground/80">
                    Level {topThree[2].level || 3}
                  </p>
                </div>
                <div className="mt-4 text-6xl font-bold text-white">3</div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Rest of Users */}
        <div className="bg-card rounded-3xl shadow-sm">
          <div className="p-6">
            <div className="space-y-2">
              {restOfUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="flex items-center p-4 hover:bg-accent rounded-2xl transition-colors"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <span className="w-8 text-lg font-semibold text-muted-foreground">
                    {index + 4}
                  </span>
                  <Avatar className="h-12 w-12 mx-4">
                    <span className="text-base font-semibold">
                      {getInitials(user.username)}
                    </span>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-medium text-foreground">
                      {formatUsername(user.username)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Level {user.level || 3}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {user.score} points
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
