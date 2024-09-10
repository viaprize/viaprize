import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card } from '@viaprize/ui/card'
import React from 'react'

export default function RecentActivities() {
  return (
    <Card className="bg-slate-50 p-3">
      <div className="text-gray-400 text-lg">Recent Activities</div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-md">
            <div className="text-semibold">John Doe</div>
            <div className="text-gray-400 text-sm">Submitted an idea</div>
          </div>
        </div>
        <div className="text-sm text-gray-600 ">2h ago</div>
      </div>
    </Card>
  );
}
