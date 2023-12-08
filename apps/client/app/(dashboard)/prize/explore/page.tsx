import { Suspense } from 'react';
import FetchPrizes from './fetchprizes';
import SkeletonLoad from './loading';
import SearchFilters from '@/components/ExplorePrize/searchFilters';

function ExplorePage() {
  return (
    <div className="max-w-screen-xl">
      <SearchFilters />
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <Suspense fallback={<SkeletonLoad />}>
          {/* @ts-expect-error Server Component */}
          <FetchPrizes />
        </Suspense>
        {/* Add as many ExploreCard components as you need */}
      </div>
    </div>
  );
}

export default ExplorePage;
