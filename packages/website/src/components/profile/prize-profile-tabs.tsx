'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@viaprize/ui/tabs'
import ExploreCard from '../prize/explore/card-details/explore-card'
import ProfileActivityCard from './profile-activity-card'

export default function PrizeProfileTabs() {
  return (
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
        {' '}
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
            <ProfileActivityCard />
            <ProfileActivityCard />
          </TabsContent>
          <TabsContent value="won">jhgfjf</TabsContent>
          <TabsContent value="joined">jhgfjf</TabsContent>
          <TabsContent value="funded">jhgfjf</TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="activities">djfhfhwofh</TabsContent>
    </Tabs>
  )
}
