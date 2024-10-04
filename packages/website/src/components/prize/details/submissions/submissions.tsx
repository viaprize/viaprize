import type { api } from "@/trpc/server";
import { Separator } from "@viaprize/ui/separator";
import { format } from "date-fns";
import SubmissionCard from "./submission-card";

export default function Submissions({
  submissions,
}: {
  submissions: NonNullable<
    Awaited<ReturnType<typeof api.prizes.getPrizeBySlug>>
  >["submissions"];
}) {
  return (
    <div className="p-3">
      <div className="text-xl">Submissions ({submissions.length})</div>
      <Separator className="my-2" />
      {submissions.map((submission) => {
        const formattedDate = format(
          new Date(submission.createdAt),
          "MMMM dd, yyyy"
        );
        return (
          <SubmissionCard
            key={submission.username}
            description={submission.description}
            name={submission.username ?? ""}
            submissionCreated={formattedDate}
          />
        );
      })}
    </div>
  );
}
