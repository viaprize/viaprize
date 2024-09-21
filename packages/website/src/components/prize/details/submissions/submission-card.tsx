import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Card } from "@viaprize/ui/card";

export default function SubmissionCard({
  name,
  avatar,
  submissionCreated,
  description,
}: {
  avatar?: string;
  name: string;
  submissionCreated: string;
  description: string;
}) {
  return (
    <Card className="p-3">
      <div className="flex items-center space-x-2">
        <Avatar className="mr-2">
          <AvatarImage src={avatar} alt="@shadcn" />
          <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-primary">John Doe</h3>
          <div className="text-muted-foreground text-sm">
            {submissionCreated}
          </div>
        </div>
      </div>
      <p>{description}</p>
    </Card>
  );
}
