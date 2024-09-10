import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Card } from "@viaprize/ui/card";

interface RecentActivitiesProps {
  name: string;
  avatar: string;
  time: string;
  activity: string;
}

export default function RecentActivities({
  name,
  avatar,
  time,
  activity,
}: RecentActivitiesProps) {
  return (
    <Card className="bg-slate-50 p-3">
      <div className="text-gray-400 text-lg">Recent Activities</div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>
              {name ? name.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="text-md">
            <div className="font-semibold">{name}</div>
            <div className="text-gray-400 text-sm">{activity}</div>
          </div>
        </div>
        <div className="text-sm text-gray-600">{time}</div>
      </div>
    </Card>
  );
}
