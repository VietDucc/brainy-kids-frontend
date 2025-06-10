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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
          </div>
        </div>

        <div className="relative bg-primary rounded-2xl sm:rounded-3xl p-6 sm:p-12 mb-6 sm:mb-8">
          <div className="flex justify-around items-end gap-2 sm:gap-4">
            {topThree[1] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Avatar className="h-16 w-16 sm:h-24 sm:w-24 border-2 sm:border-4 border-white mb-2 sm:mb-4">
                  {topThree[1].profile_image_url ? (
                    <Image
                      src={topThree[1].profile_image_url}
                      alt={topThree[1].username}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-base">
                      {getInitials(topThree[1].username)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-semibold text-sm sm:text-lg truncate max-w-[80px] sm:max-w-none">
                    {formatUsername(topThree[1].username)}
                  </p>
                  <p className="text-primary-foreground/80 text-xs sm:text-base">
                    {topThree[1].score} điểm
                  </p>
                </div>
                <div className="mt-2 sm:mt-4 text-3xl sm:text-6xl font-bold text-white">
                  2
                </div>
              </motion.div>
            )}

            {topThree[0] && (
              <motion.div
                className="flex flex-col items-center -mt-4 sm:-mt-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Avatar className="h-20 w-20 sm:h-32 sm:w-32 border-2 sm:border-4 border-yellow-400 mb-2 sm:mb-4">
                  {topThree[0].profile_image_url ? (
                    <Image
                      src={topThree[0].profile_image_url}
                      alt={topThree[0].username}
                      width={128}
                      height={128}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg sm:text-2xl font-bold">
                      {getInitials(topThree[0].username)}
                    </span>
                  )}
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-bold text-base sm:text-xl truncate max-w-[100px] sm:max-w-none">
                    {formatUsername(topThree[0].username)}
                  </p>
                  <p className="text-primary-foreground/80 text-xs sm:text-base">
                    {topThree[0].score} điểm
                  </p>
                </div>
                <div className="mt-2 sm:mt-4 text-4xl sm:text-7xl font-bold text-white">
                  1
                </div>
              </motion.div>
            )}

            {topThree[2] && (
              <motion.div
                className="flex flex-col items-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Avatar className="h-16 w-16 sm:h-24 sm:w-24 border-2 sm:border-4 border-white mb-2 sm:mb-4">
                  {topThree[2].profile_image_url ? (
                    <Image
                      src={topThree[2].profile_image_url}
                      alt={topThree[2].username}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm sm:text-xl font-bold">
                      {getInitials(topThree[2].username)}
                    </span>
                  )}
                </Avatar>
                <div className="text-center text-white">
                  <p className="font-semibold text-sm sm:text-lg truncate max-w-[80px] sm:max-w-none">
                    {formatUsername(topThree[2].username)}
                  </p>
                  <p className="text-primary-foreground/80 text-xs sm:text-base">
                    {topThree[2].score} điểm
                  </p>
                </div>
                <div className="mt-2 sm:mt-4 text-3xl sm:text-6xl font-bold text-white">
                  3
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl sm:rounded-3xl shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="space-y-1 sm:space-y-2">
              {restOfUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="flex items-center p-3 sm:p-4 hover:bg-accent rounded-xl sm:rounded-2xl transition-colors"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <span className="w-6 sm:w-8 text-base sm:text-lg font-semibold text-muted-foreground">
                    {index + 4}
                  </span>
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 mx-3 sm:mx-4">
                    {user.profile_image_url ? (
                      <Image
                        src={user.profile_image_url}
                        alt={user.username}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm sm:text-base font-semibold">
                        {getInitials(user.username)}
                      </span>
                    )}
                  </Avatar>
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base truncate">
                      {formatUsername(user.username)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
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
