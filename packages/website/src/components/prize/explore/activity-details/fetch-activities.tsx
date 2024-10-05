'use client'
import OverallPrizeStatus from '@/components/stats-cards/overall-prize-status'
import { api } from '@/trpc/react'
import { Suspense } from 'react'
import Leaderboard from './leaderboard'
import RecentActivities from './recent-activities'

export default function FetchActivities() {
  const [activities] = api.prizes.getPrizeActivities.useSuspenseQuery()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="space-y-6">
        <OverallPrizeStatus
          totalIdeas={activities.totalIdeas}
          totalPrizePool={activities.totalPrizePool}
        />
        <RecentActivities activities={activities.recentActivities} />
        {/* <Leaderboard leaderboardEntries={leaderboardEntries} /> */}
      </div>
    </Suspense>
  )
}
