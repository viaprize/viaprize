import ExploreCard from '@/components/ExplorePrize/explorePrize';
import AppShellLayout from '@/components/layout/appshell';
import { Tabs } from '@mantine/core';
import type { ReactElement } from 'react';

export default function Profile() {
  return (
    <Tabs variant="pills" defaultValue="pending">
      <Tabs.List justify="center">
        <Tabs.Tab value="pending">Pending</Tabs.Tab>
        <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
        <Tabs.Tab value="accepted">Accepted</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="pending" pt="xs">
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
            money="$500"
            deadline="yourDeadline"
          />
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="yourDescription"
            money="$500"
            deadline="yourDeadline"
          />
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="yourDescription"
            money="$500"
            deadline="yourDeadline"
          />
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="yourDescription"
            money="$500"
            deadline="yourDeadline"
          />
          {/* Add as many ExploreCard components as you need */}
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="accepted" pt="xs">
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
            money="$500"
            deadline="yourDeadline"
          />
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="yourDescription"
            money="$500"
            deadline="yourDeadline"
          />
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="yourDescription"
            money="$500"
            deadline="yourDeadline"
          />
        </div>
      </Tabs.Panel>

      <Tabs.Panel value="rejected" pt="xs">
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
            money="$500"
            deadline="yourDeadline"
          />
          <ExploreCard
            imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
            title="yourTitle"
            profileName="yourProfileName"
            description="yourDescription"
            money="$500"
            deadline="yourDeadline"
          />
        </div>
      </Tabs.Panel>
    </Tabs>
  );
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
