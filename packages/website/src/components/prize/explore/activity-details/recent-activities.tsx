import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Card } from "@viaprize/ui/card";

interface Activity {
  name: string;
  avatar: string;
  time: string;
  activity: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <Card className="p-3">
      <div className="text-card-foreground/80 text-lg">Recent Activities</div>
      <div className="space-y-2 mt-4">
        {activities.map((activityItem, index) => (
          <div className="flex items-center justify-between py-1" key={index}>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={activityItem.avatar}
                  alt={activityItem.name}
                />
                <AvatarFallback>
                  {activityItem.name
                    ? activityItem.name.charAt(0).toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-semibold">{activityItem.name}</div>
                <div className="text-gray-400 text-sm">
                  {activityItem.activity}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">{activityItem.time}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
