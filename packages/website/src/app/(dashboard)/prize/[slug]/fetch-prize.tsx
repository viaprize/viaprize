import AboutContent from "@/components/prize/details/about-content";
import DetailHeader from "@/components/prize/details/details-header";
import Submissions from "@/components/prize/details/submissions/submissions";
import ContestantsCard, {
  type ContestantStage,
} from "@/components/prize/details/vfc-details/contestants-card";
import VisionaryFunderCard from "@/components/prize/details/vfc-details/visionary-funder-card";
import Winners from "@/components/prize/details/vfc-details/winners";
import VotingSection from "@/components/prize/details/voting/voting-section";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

import { IconArrowLeft } from "@tabler/icons-react";
import { Separator } from "@viaprize/ui/separator";

const getContestantStage = (
  contestants:
    | {
        username: string;
        avatar: string | null;
      }[]
    | undefined,
  username: string
): ContestantStage => {
  if (!contestants) {
    return "NOT_JOINED";
  }
  if (contestants.some((c) => c.username === username)) {
    return "JOINED";
  }
  return "NOT_JOINED";
};
export default async function FetchPrize({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const prize = await api.prizes.getPrizeBySlug(slug);
  console.log(prize?.contestants, "contestants");
  const contestants = prize?.contestants
    .map((c) => {
      if (c.user.username) {
        return { username: c.user.username, avatar: c.user.image };
      }
    })
    .filter((c) => !!c);
  console.log(contestants);
  if (!prize) {
    return <div>Prize not found</div>;
  }
  const session = await auth();
  if (session && !session.user.username) {
    return <div>Complete Sign Up </div>;
  }
  const contestantStage = getContestantStage(
    contestants,
    session?.user.username ?? ""
  );
  return (
    <div className="lg:flex h-full">
      <div className="w-full space-y-3 md:w-[75%] h-full lg:max-h-screen overflow-auto border-r-2">
        <div className="flex items-center text-sm font-semibold ml-3 mt-3">
          <IconArrowLeft className="mr-1" size={20} /> Back
        </div>
        <DetailHeader
          funds={prize.funds}
          projectName={prize.title}
          name={prize.author.name ?? prize.authorUsername}
          stage={prize.stage}
          image={prize.imageUrl}
          avatar={prize.author.avatar || ""}
          title={prize.title}
          prizeId={prize.id}
        />
        <Separator className="my-2" />
        <AboutContent badges={["Technology"]} description={prize.description} />
        <Submissions submissions={prize.submissions} />
        <VotingSection users={[]} />
        <StartSubmissionButton />
      </div>
      <div className="w-full lg:w-[25%] mt-5 mx-3 space-y-5 lg:max-h-screen lg:overflow-auto">
        <Winners />
        <VisionaryFunderCard
          name={prize.author.name ?? prize.authorUsername}
          numberOfFunders={prize.numberOfFunders}
          totalFunds={prize.funds}
          avatar={prize.author.avatar}
        />
        <ContestantsCard
          contestantStage={contestantStage}
          contestants={contestants}
          prizeId={prize.id}
          slug={slug}
        />
      </div>
    </div>
  );
}
