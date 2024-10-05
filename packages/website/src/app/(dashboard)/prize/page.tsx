import FetchActivities from '@/components/prize/explore/activity-details/fetch-activities'
import FetchExploreCard from '@/components/prize/explore/card-details/fetch-explore-card'
import type { SearchParams } from '@/lib/utils'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <div className="flex h-full">
      <div className="w-full  h-full border-r-2">
        <FetchExploreCard searchParams={searchParams} />
      </div>
      <div className="w-[25%] mt-5 mx-3 md:block hidden">
        <FetchActivities />
      </div>
    </div>
  )
}
