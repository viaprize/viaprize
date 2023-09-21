import usePrizeProposal from "@/components/Prize/hooks/usePrizeProposal";
import ExploreCard from "@/components/ExplorePrize/explorePrize";
import { SearchFilters } from "@/components/ExplorePrize/searchFilters";
import AppShellLayout from "@/components/layout/appshell";
import { usePrivy } from "@privy-io/react-auth";
import { ReactElement, useEffect } from "react";

const ExplorePage = () => {
  const { getProposalsOfUser } = usePrizeProposal();
  const { user } = usePrivy();

  useEffect(() => {
    console.log("hiiii");

    getProposalsOfUser().then((res) => {
      console.log(res, "Res");
    });
  }, []);
  if (!user) {
    return null;
  }
  return (
    <div className="max-w-screen-xl">
      <SearchFilters />
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="shortDescription goes here shortDescription goes
           here short Description goes here shortDescription goes here
            short Description goes here shortDescription goes here shortDescription goes here "
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="yourDescription"
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="yourDescription"
          money="$500"
          deadline="yourDeadline"
        />
        <ExploreCard
          imageUrl="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          title="yourTitle"
          profileName="yourProfileName"
          description="yourDescription"
          money="$500"
          deadline="yourDeadline"
        />
        {/* Add as many ExploreCard components as you need */}
      </div>
    </div>
  );
};

ExplorePage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};

export default ExplorePage;
