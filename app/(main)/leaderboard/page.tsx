"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";

interface LeaderboardUser {
  id: number;
  clerkUserId: string;
  username: string;
  score: number;
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

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-pink-200",
      "bg-purple-200",
      "bg-blue-200",
      "bg-green-200",
      "bg-yellow-200",
      "bg-orange-200",
      "bg-red-200",
      "bg-teal-200",
    ];
    return colors[id % colors.length];
  };

  const getTrophyIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 2:
        return <Award className="h-8 w-8 text-amber-700" />;
      default:
        return <Star className="h-6 w-6 text-purple-400" />;
    }
  };

  if (isLoading) {
    return <Loading text="leaderboard..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
        <div className="text-red-500 text-6xl mb-4">😢</div>
        <h2 className="text-xl font-bold text-red-500 mb-4">{error}</h2>
        <Button
          onClick={() => window.location.reload()}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-white w-full py-8">
      <div className="max-w-3xl mx-auto px-4">
        <header className="text-center mb-12">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Learning Champions
          </motion.h1>
          <motion.p
            className="text-sm text-gray-600"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Keep learning and climb the leaderboard!
          </motion.p>
        </header>

        {/* Top 3 */}
        <motion.div
          className="flex justify-between items-end gap-4 mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* 2 */}
          {topThree[1] && (
            <div className="flex-1">
              <PodiumPosition
                user={topThree[1]}
                position={1}
                getInitials={getInitials}
                getAvatarColor={getAvatarColor}
                getTrophyIcon={getTrophyIcon}
                formatUsername={formatUsername}
                height="h-24 md:h-32"
              />
            </div>
          )}

          {/* 1 */}
          {topThree[0] && (
            <div className="flex-1 z-10">
              <PodiumPosition
                user={topThree[0]}
                position={0}
                getInitials={getInitials}
                getAvatarColor={getAvatarColor}
                getTrophyIcon={getTrophyIcon}
                formatUsername={formatUsername}
                height="h-32 md:h-40"
                isFirst={true}
              />
            </div>
          )}

          {/* 3 */}
          {topThree[2] && (
            <div className="flex-1">
              <PodiumPosition
                user={topThree[2]}
                position={2}
                getInitials={getInitials}
                getAvatarColor={getAvatarColor}
                getTrophyIcon={getTrophyIcon}
                formatUsername={formatUsername}
                height="h-20 md:h-28"
              />
            </div>
          )}
        </motion.div>

        {/* còn lại */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Tất cả người học
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {restOfUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="flex items-center py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="flex-shrink-0 w-8 text-sm font-medium text-gray-500">
                    #{index + 4}
                  </div>
                  <Avatar
                    className={`${getAvatarColor(user.id)} h-10 w-10 mx-3`}
                  >
                    <div className="text-sm font-medium">
                      {getInitials(user.username)}
                    </div>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="font-medium text-gray-900">
                      {formatUsername(user.username)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">
                      {user.score}
                    </span>
                  </div>
                </motion.div>
              ))}

              {restOfUsers.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                  No more learners to show
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface PodiumPositionProps {
  user: LeaderboardUser;
  position: number;
  getInitials: (username: string) => string;
  getAvatarColor: (id: number) => string;
  getTrophyIcon: (position: number) => React.ReactNode;
  formatUsername: (username: string) => string;
  height: string;
  isFirst?: boolean;
}

function PodiumPosition({
  user,
  position,
  getInitials,
  getAvatarColor,
  getTrophyIcon,
  formatUsername,
  height,
  isFirst = false,
}: PodiumPositionProps) {
  return (
    <motion.div className="flex flex-col items-center">
      <motion.div
        className="mb-2"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 * position }}
      >
        {getTrophyIcon(position)}
      </motion.div>

      <motion.div
        className={`w-full ${
          isFirst ? "bg-white border-yellow-200" : "bg-white"
        } rounded-lg p-3 text-center border shadow-sm`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 * position + 0.2 }}
      >
        <Avatar
          className={`${getAvatarColor(
            user.id
          )} h-14 w-14 mx-auto mb-2 border-2 ${
            isFirst ? "border-yellow-200" : "border-gray-200"
          }`}
        >
          <div className="text-base font-medium">
            {getInitials(user.username)}
          </div>
        </Avatar>
        <h3 className="font-medium text-gray-900 text-sm mb-1 truncate max-w-[100px] mx-auto">
          {formatUsername(user.username)}
        </h3>
        <div className="flex items-center justify-center gap-1">
          <Star
            className={`h-4 w-4 ${
              isFirst ? "text-yellow-500" : "text-yellow-400"
            }`}
          />
          <span
            className={`font-semibold text-sm ${
              isFirst ? "text-gray-900" : "text-gray-700"
            }`}
          >
            {user.score}
          </span>
        </div>
      </motion.div>

      <motion.div
        className={`${height} w-full rounded-b shadow-sm ${
          position === 0
            ? "bg-yellow-100"
            : position === 1
            ? "bg-gray-100"
            : "bg-orange-100"
        }`}
        initial={{ height: 0 }}
        animate={{ height: height.split(" ")[1] }}
        transition={{ delay: 0.2 * position + 0.4, duration: 0.5 }}
      />
    </motion.div>
  );
}
