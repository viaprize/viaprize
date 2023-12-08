'use client';
import SearchFilters from '@/components/ExplorePrize/searchFilters';
import { Text } from '@mantine/core';
import PortalCards from './portalcards';
export default function ExplorePortal() {
  return (
    <div className="max-w-screen-xl">
      <Text size="25px" fw="bolder" mt="md" ml="md">
        Explore Portal
      </Text>
      <Text size="md" fw="initial" mt="xs" ml="md">
        you can explore portal and work on them
      </Text>
      <SearchFilters />
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <PortalCards
          imageUrl={''}
          title={'asdfasdflkjhafsdkjfjksa'}
          authorName={'sadfsa'}
          description={
            'skajhfkj asdkjhf skajdhf kjsdahf kjsdha fkjhads fh sakdjhf ksajdhf kj '
          }
          amountRaised={'asdf'}
          totalContributors={'sadf'}
          shareUrl={'sdafsad'}
          id={'sadfasd'}
        />
      </div>
    </div>
  );
}
