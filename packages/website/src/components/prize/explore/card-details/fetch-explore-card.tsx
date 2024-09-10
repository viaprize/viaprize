import FilterSort from '@/components/common/filter-sort'
import ExploreCard from './explore-card'

export default function FetchExploreCard() {
  return (
    <section>
      <div className="flex w-full justify-between items-center p-6">
        <h2 className="font-semibold">56 Active Prizes</h2>
        <FilterSort />
      </div>
      <section className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3 pb-3 px-7">
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
      </section>
    </section>
  )
}
