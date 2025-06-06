"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface LeaderboardUser {
  id: number;
  clerkUserId: string;
  username: string;
  score: number;
  profile_image_url?: string;
}

interface LeaderboardClientProps {
  leaderboardData: LeaderboardUser[];
}

export function LeaderboardClient({ leaderboardData }: LeaderboardClientProps) {
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
                  {topThree[1].profile_image_url ? (
                    <Image
                      src={topThree[1].profile_image_url}
                      alt={topThree[1].username}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(topThree[1].username)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-semibold text-lg">
                    {formatUsername(topThree[1].username)}
                  </p>
                  <p className="text-primary-foreground/80">
                    {topThree[1].score} điểm
                  </p>
                </div>
                <div className="mt-4 text-6xl font-bold text-white">2</div>
              </motion.div>
            )}

            {topThree[0] && (
              <motion.div
                className="flex flex-col items-center -mt-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Avatar className="h-32 w-32 border-4 border-yellow-400 mb-4">
                  {topThree[0].profile_image_url ? (
                    <Image
                      src={topThree[0].profile_image_url}
                      alt={topThree[0].username}
                      width={128}
                      height={128}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {getInitials(topThree[0].username)}
                    </span>
                  )}
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-bold text-xl">
                    {formatUsername(topThree[0].username)}
                  </p>
                  <p className="text-primary-foreground/80">
                    {topThree[0].score} điểm
                  </p>
                </div>
                <div className="mt-4 text-7xl font-bold text-white">1</div>
              </motion.div>
            )}

            {topThree[2] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Avatar className="h-24 w-24 border-4 border-white mb-4">
                  {topThree[2].profile_image_url ? (
                    <Image
                      src={topThree[2].profile_image_url}
                      alt={topThree[2].username}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold">
                      {getInitials(topThree[2].username)}
                    </span>
                  )}
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-semibold text-lg">
                    {formatUsername(topThree[2].username)}
                  </p>
                  <p className="text-primary-foreground/80">
                    {topThree[2].score} điểm
                  </p>
                </div>
                <div className="mt-4 text-6xl font-bold text-white">3</div>
              </motion.div>
            )}
          </div>
        </div>

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
                    {user.profile_image_url ? (
                      <Image
                        src={user.profile_image_url}
                        alt={user.username}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-semibold">
                        {getInitials(user.username)}
                      </span>
                    )}
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-medium text-foreground">
                      {formatUsername(user.username)}
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
