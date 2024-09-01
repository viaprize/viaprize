import FetchExploreCard from "@/components/prize/explore/fetch-explore-card";

export default function ExplorePage() {
  return (
    <div className="flex h-full">
      <div className="w-[75%] h-full border-r-2">
        {/* <div className="mt-2 w-[35%] ml-3">
          <OverallPrizeStatus />
        </div>
        <Separator className="mb-7 mt-4 w-full" /> */}
        <FetchExploreCard />
      </div>
      <div className="w-[25%] mt-5 mx-2">wdufiuew</div>
    </div>
  );
}
