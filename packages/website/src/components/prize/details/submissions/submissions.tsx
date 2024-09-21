import { Separator } from "@viaprize/ui/separator";
import SubmissionCard from "./submission-card";

export default function Submissions() {
  return (
    <div className="p-3">
      <div className="text-xl">Submissions (1)</div>
      <Separator className="my-2" />
      <SubmissionCard
        description="sdfdsfd"
        name="sdfdsf"
        submissionCreated={new Date().toDateString()}
      />
    </div>
  );
}
