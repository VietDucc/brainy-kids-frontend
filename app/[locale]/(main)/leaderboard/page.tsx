import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { LeaderboardClient } from "./leaderboard-client";
import { LeaderboardSkeleton } from "./leaderboard-skeleton";
import { api } from "@/app/api/config";

interface LeaderboardUser {
  id: number;
  clerkUserId: string;
  username: string;
  score: number;
  profile_image_url?: string;
}

async function getLeaderboardData(token: string): Promise<LeaderboardUser[]> {
  try {
    const response = await fetch(api.leaderboard, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard data");
    }

    const data = await response.json();

    // Filter and sort data
    const validUsers = data.filter(
      (user: LeaderboardUser) =>
        user.username &&
        user.username !== "null null" &&
        user.username !== "string string"
    );

    return [...validUsers].sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export default async function LeaderboardPage() {
  const { getToken } = await auth();
  const token = await getToken({ template: "jwt-clerk" });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Unauthorized access</p>
      </div>
    );
  }

  try {
    const leaderboardData = await getLeaderboardData(token);

    if (leaderboardData.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">No leaderboard data available</p>
        </div>
      );
    }

    return (
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardClient leaderboardData={leaderboardData} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in LeaderboardPage:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Oops! We couldn&apos;t load the leaderboard. Please try again later!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
}
