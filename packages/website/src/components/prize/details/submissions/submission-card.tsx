import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Card } from "@viaprize/ui/card";


export default function SubmissionCard() {
  return (
    <Card className="p-3">
      <div className="flex items-center space-x-2">
        <Avatar className="mr-2">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-primary">John Doe</h3>
          <div className="text-muted-foreground text-sm">Submitted 2 days ago</div>
          </div>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in
        vestibulum purus. Nullam nec sapien et turpis tincidunt tempus
      </p>
    </Card>
  );
}
