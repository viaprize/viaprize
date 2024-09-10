import FetchActivities from '@/components/prize/explore/activity-details/fetch-activities'
import FetchExploreCard from '@/components/prize/explore/card-details/fetch-explore-card'

export default async function ExplorePage() {
  return (
    <div className="flex h-full">
      <div className="w-full md:w-[75%] h-full border-r-2">
        <FetchExploreCard />
      </div>
      <div className="w-[25%] mt-5 mx-2 md:block hidden">
        <FetchActivities />
      </div>
    </div>
  )
}
