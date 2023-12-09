'use client';
import { Text } from '@mantine/core';
import PortalCards from './portal-card';

import SearchFiltersPortals from './search-filters-portals';
export default function ExplorePortal() {
  return (
    <div className="max-w-screen-xl">
      <Text size="25px" fw="bolder" mt="md" ml="md">
        Explore Portal
      </Text>
      <Text size="md" fw="initial" mt="xs" ml="md">
        you can explore portal and work on them
      </Text>
      <SearchFiltersPortals />
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <PortalCards
          imageUrl=""
          title="some random project"
          authorName="Swaraj Bachu"
          description="skajhfkj asdkjhf skajdhf kjsdahf kjsdha fkjhads fh sakdjhf ksajdhf kj "
          amountRaised="100"
          totalContributors="500"
          shareUrl="https://www.google.com"
          id="portalsdude"
        />
      </div>
    </div>
  );
}
