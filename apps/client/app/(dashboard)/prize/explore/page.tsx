import ExploreCard from '@/components/ExplorePrize/explorePrize';
import SearchFilters from '@/components/ExplorePrize/searchFilters';
import { formatEther } from 'viem';
import { Api } from '@/lib/api';

async function ExplorePage() {

 const prizes = (
   await new Api().prizes.prizesList({
     limit: 10,
     page: 1,
   })
 ).data.data;
 
  return (
    <div className="max-w-screen-xl">
      <SearchFilters />
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        {prizes.map((prize) => {
          return (
            <ExploreCard
              description={prize.description}
              imageUrl={prize.images[0]}
              deadline=""
              money={formatEther(BigInt(prize.balance))}
              profileName={prize.user ? prize.user.name : ''}
              title={prize.title}
              key={prize.id}
              id={prize.id}
            />
          );
        })}
        {/* Add as many ExploreCard components as you need */}
      </div>
    </div>
  );
}

export default ExplorePage;


