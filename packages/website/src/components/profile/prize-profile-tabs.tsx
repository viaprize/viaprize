'use client'

import { api } from '@/trpc/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@viaprize/ui/tabs'
import { Suspense } from 'react'
import RecentActivities from '../prize/explore/activity-details/recent-activities'
import ExploreCard from '../prize/explore/card-details/explore-card'
import ProfileActivityCard from './profile-activity-card'

export default function PrizeProfileTabs({ username }: { username: string }) {
  const [stats] = api.users.getUserStatistics.useSuspenseQuery(username)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tabs defaultValue="prizes" className="w-full">
        <TabsList className="w-full bg-background flex items-center justify-between">
          <TabsTrigger
            value="prizes"
            className="w-full p-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary "
          >
            Prizes
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="w-full p-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Activities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="prizes">
          <Tabs defaultValue="created" className="w-full mt-3">
            <TabsList className="w-full flex justify-start bg-background items-center space-x-5 ml-2 ">
              <TabsTrigger
                value="created"
                className="border data-[state=active]:border-primary data-[state=active]:bg-green-100 "
              >
                Created
              </TabsTrigger>
              <TabsTrigger
                value="won"
                className="border data-[state=active]:border-primary data-[state=active]:bg-green-100 "
              >
                Won
              </TabsTrigger>
              <TabsTrigger
                value="joined"
                className="border data-[state=active]:border-primary data-[state=active]:bg-green-100 "
              >
                Joined
              </TabsTrigger>
              <TabsTrigger
                value="funded"
                className="border data-[state=active]:border-primary data-[state=active]:bg-green-100 "
              >
                Funded
              </TabsTrigger>
            </TabsList>
            <TabsContent value="created" className="p-2 space-y-3">
              {stats.createdPrizes.map((prize) => (
                <ProfileActivityCard key={prize.id} prize={prize} />
              ))}
            </TabsContent>
            <TabsContent value="won">
              {stats.wonPrizes.map((prize) => (
                <ProfileActivityCard key={prize.prize.id} prize={prize.prize} />
              ))}
            </TabsContent>
            <TabsContent value="joined">
              {stats.prizesContested.map((prize) => (
                <ProfileActivityCard key={prize.prize.id} prize={prize.prize} />
              ))}
            </TabsContent>
            <TabsContent value="funded">
              {stats.prizesFunded.map((prize) =>
                prize.prize ? (
                  <ProfileActivityCard
                    key={prize.prize.id}
                    prize={prize.prize}
                  />
                ) : null,
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="activities">
          <RecentActivities activities={stats.userActivities} />
        </TabsContent>
      </Tabs>
    </Suspense>
  )
}
