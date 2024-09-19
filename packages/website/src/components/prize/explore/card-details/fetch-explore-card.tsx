import FilterSort from '@/components/common/filter-sort'
import { api } from '@/trpc/server'
import ExploreCard from './explore-card'

export default async function FetchExploreCard() {
  const activePrizes = await api.prizes.getActivePrizes()
  const deployedPrizes = await api.prizes.getDeployedPrizes()
  return (
    <section>
      <div className="flex w-full justify-between items-center p-6">
        <h2 className="font-semibold">{activePrizes} Active Prizes</h2>
        <FilterSort />
      </div>
      <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 pb-3 px-7">
        {deployedPrizes?.map((prize) => (
          <ExploreCard
            funds={prize.funds ?? 0}
            imageUrl={prize.imageUrl ?? ''}
            title={prize.title}
            prizeStage={prize.stage ?? 'NOT_STARTED'}
            numberOfContestants={prize.numberOfContestants ?? 0}
            numberOfFunders={prize.numberOfFunders ?? 0}
            numberOfComments={prize.numberOfComments ?? 0}
            key={prize.id}
          />
        ))}
      </section>
    </section>
  )
}
