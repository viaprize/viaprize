import OverallPrizeStatus from "@/components/common/overall-prize-status";
import RecentActivities from "./recent-activities";
import Leaderboard from "./leaderboard";

export default function FetchActivities() {
  return (
    <div className="space-y-3">
      <OverallPrizeStatus />
      <RecentActivities
        name="John Doe"
        avatar="https://github.com/shadcn.png"
        time="2h ago"
        activity="Submitted an idea"
      />
      <RecentActivities
        name="Jane Smith"
        avatar="https://example.com/jane-avatar.png"
        time="1h ago"
        activity="Commented on a post"
      />
      <Leaderboard />
    </div>
  );
}
