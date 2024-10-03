"use client";
import OverallPrizeStatus from "@/components/stats-cards/overall-prize-status";
import Leaderboard from "./leaderboard";
import RecentActivities from "./recent-activities";
import { api } from "@/trpc/react";
import { Suspense } from "react";
const activities = [
  {
    name: "Alice",
    avatar: "https://github.com/shadcn.png",
    time: "5m ago",
    activity: "Completed a task",
  },
];

const leaderboardEntries = [
  {
    name: "Michael Lee",
    avatar: "https://github.com/shadcn.png",
    project: "Project Name 3",
    earned: 400,
    rank: 3,
  },
];
export default function FetchActivities() {
  const [activities] = api.prizes.getPrizeActivites.useSuspenseQuery();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-6">
        <OverallPrizeStatus
          totalIdeas={activities.totalIdeas}
          totalPrizePool={activities.totalPrizePool}
        />
        <RecentActivities activities={activities.recentActivites} />
        <Leaderboard leaderboardEntries={leaderboardEntries} />
      </div>
    </Suspense>
  );
}
