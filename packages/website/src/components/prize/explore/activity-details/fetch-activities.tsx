import OverallPrizeStatus from '@/components/stats-cards/overall-prize-status'
import Leaderboard from './leaderboard'
import RecentActivities from './recent-activities'
const activities = [
  {
    name: 'Alice',
    avatar: 'https://github.com/shadcn.png',
    time: '5m ago',
    activity: 'Completed a task',
  },
  {
    name: 'Bob',
    avatar: 'https://github.com/shadcn.png',
    time: '10m ago',
    activity: 'Won a prize',
  },
  {
    name: 'Charlie',
    avatar: 'https://github.com/shadcn.png',
    time: '15m ago',
    activity: 'Joined the platform',
  },
]

const leaderboardEntries = [
  {
    name: 'John Doe',
    avatar: 'https://github.com/shadcn.png',
    project: 'Project Name 1',
    earned: 300,
    rank: 1,
  },
  {
    name: 'Jane Smith',
    avatar: 'https://github.com/shadcn.png',
    project: 'Project Name 2',
    earned: 250,
    rank: 2,
  },
  {
    name: 'Michael Lee',
    avatar: 'https://github.com/shadcn.png',
    project: 'Project Name 3',
    earned: 400,
    rank: 3,
  },
]
export default function FetchActivities() {
  return (
    <div className="space-y-6">
      <OverallPrizeStatus />
      <RecentActivities activities={activities} />
      <Leaderboard leaderboardEntries={leaderboardEntries} />
    </div>
  )
}
