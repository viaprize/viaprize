import FilterSort from '@/components/common/filter-sort'
import ExploreCard from './explore-card'

export default function FetchExploreCard() {
  return (
    <section>
      <div className="flex w-full justify-between items-center p-6">
        <h2 className="font-semibold">56 Active Prizes</h2>
        <FilterSort />
      </div>
      <section className="grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 pb-3 px-7">
        <ExploreCard />
        <ExploreCard />
        <ExploreCard />
      </section>
      {/* <Tabs defaultValue="allprizes" className="w-full">
        <TabsList className="flex w-full justify-center space-x-6 bg-background">
          <TabsTrigger value="allprizes">All Prizes</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inreview">In review</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <div className="flex w-full justify-end p-6">
          <FilterSort />
        </div>
        <TabsContent
          value="allprizes"
          className="grid grid-cols-3 gap-3 pb-3 px-7"
        >
          <ExploreCard />
          <ExploreCard />
          <ExploreCard />
        </TabsContent>
        <TabsContent value="bookmarked">ehowhroi wiorqoi</TabsContent>
        <TabsContent value="active">ehowhroi wiorqoi</TabsContent>
        <TabsContent value="inreview">ehowhroi wiorqoi</TabsContent>
        <TabsContent value="completed">ehowhroi wiorqoi</TabsContent>
      </Tabs> */}
    </section>
  )
}
