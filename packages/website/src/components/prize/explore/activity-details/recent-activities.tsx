import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card } from '@viaprize/ui/card'

interface Activity {
  name: string
  avatar: string
  time: string
  activity: string
}

interface RecentActivitiesProps {
  activities: Activity[]
}

export default function RecentActivities({
  activities,
}: RecentActivitiesProps) {
  return (
    <Card className="p-3 text-sm text-muted-foreground">
      <div className="text-card-foreground/60 text-lg ">Recent Activities</div>
      <div className="space-y-2 mt-3">
        {activities.map((activityItem) => (
          <div
            className="flex items-center justify-between py-1"
            key={activityItem.name}
          >
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={activityItem.avatar}
                  alt={activityItem.name}
                />
                <AvatarFallback>
                  {activityItem.name
                    ? activityItem.name.charAt(0).toUpperCase()
                    : '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-black">
                  {activityItem.name}
                </div>
                <div>{activityItem.activity}</div>
              </div>
            </div>
            <div>{activityItem.time}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
