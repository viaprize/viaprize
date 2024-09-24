import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Button } from "@viaprize/ui/button";
import { Card } from "@viaprize/ui/card";
import SubmitWorkButton from "../submissions/submit-work-button";
import JoinContestantButton from "./join-contestant-button";
export type ContestantStage = "NOT_JOINED" | "JOINED" | "SUBMITTED";

function ContestantCardButton({
  stage,
  prizeId,
  slug,
}: {
  stage: ContestantStage;
  prizeId: string;
  slug: string;
}) {
  return (
    <>
      {(() => {
        switch (stage) {
          case "NOT_JOINED":
            return <JoinContestantButton prizeId={prizeId} slug={slug} />;
          case "JOINED":
            return <SubmitWorkButton prizeId={prizeId} />;
          case "SUBMITTED":
            return null;
        }
      })()}
    </>
  );
}
export default function ContestantsCard({
  contestants,
  contestantStage,
  prizeId,
  slug,
}: {
  contestants?: {
    username: string;
    avatar: string | null;
  }[];
  contestantStage: ContestantStage;
  prizeId: string;
  slug: string;
}) {
  return (
    <Card className="px-3 py-4">
      <div className="text-muted-foreground text-lg font-normal">
        Contestants ({contestants?.length})
      </div>
      {contestants?.map((contestant) => (
        <div
          className="flex items-center space-x-2 mt-2"
          key={contestant.username}
        >
          <Avatar>
            <AvatarImage
              src={contestant.avatar ?? undefined}
              alt={contestant.username.substring(0, 2)}
            />
            <AvatarFallback>{contestant.username.substring(2)}</AvatarFallback>
          </Avatar>
          <div>{contestant.username}</div>
        </div>
      ))}
      <ContestantCardButton
        stage={contestantStage}
        prizeId={prizeId}
        slug={slug}
      />
    </Card>
  );
}
