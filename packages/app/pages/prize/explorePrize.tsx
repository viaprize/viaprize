import ExploreCard from "@/components/PrizeComponents/explorePrize";
import { SearchFilters } from "@/components/PrizeComponents/searchFilters";

const ExplorePage = () => {

    return (

        <>
        <SearchFilters />
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
                <ExploreCard />
                <ExploreCard />
                <ExploreCard />
                <ExploreCard />
                {/* Add as many ExploreCard components as you need */}
            </div>
        </>
        
    )
}

export default ExplorePage;