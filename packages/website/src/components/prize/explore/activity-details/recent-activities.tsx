
import { timeAgo } from "@/lib/utils";
import type { api } from "@/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Card } from "@viaprize/ui/card";

export type Activity = Pick<
  Awaited<ReturnType<typeof api.prizes.getPrizeActivities>>,
  "recentActivities"
>["recentActivities"];

export default function RecentActivities({
  activities,
}: {
  activities: Activity
}) {
  return (
    <Card className="p-3 text-sm text-muted-foreground">
      <div className="text-card-foreground/60 text-lg ">Recent Activities</div>
      <div className="space-y-2 mt-3">
        {activities.map((activityItem) => (
          <div
            className="flex items-center justify-between py-1"
            key={`${activityItem.activity}-${activityItem.user.username}-${activityItem.createdAt}`}
          >
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={activityItem.user.image ?? undefined}
                  alt={activityItem.user.username ?? undefined}
                />
                <AvatarFallback>
                  {activityItem.user.username
                    ? activityItem.user.username.charAt(0).toUpperCase()
                    : '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-black">
                  {activityItem.user.username}
                </div>
                <div>{activityItem.activity}</div>
              </div>
            </div>
            <div>{timeAgo(activityItem.createdAt)}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
