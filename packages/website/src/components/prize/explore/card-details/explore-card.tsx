import { IconCalendarTime, IconCoins, IconMessageCircle, IconUsersGroup } from '@tabler/icons-react';
import { Badge } from '@viaprize/ui/badge'
import { Card, CardContent } from '@viaprize/ui/card'
import { Separator } from '@viaprize/ui/separator';

import Image from 'next/image'

export default function ExploreCard() {
  return (
    <Card className="p-3">
      <Image
        src="https://github.com/shadcn.png"
        width={50}
        height={50}
        objectFit="cover"
        alt=""
        className="h-40 w-full rounded-md object-cover"
      />
      <div className="flex items-center justify-between mt-5">
        <div className="text-xl text-primary/80 font-medium">
         $80,000
        </div>
        <Badge
          variant="secondary"
          className="text-green-600 px-2 py-1 font-normal"
        >
          Submission Open
        </Badge>
      </div>
      <Separator className="h-3px my-3" />
      <h1 className="font-medium text-card-foreground/80">
        Rebuild the text editor in the network society form
      </h1>

      <div className="mt-3">
        <Badge variant="outline" color="gray" className="text-gray-400">
          Technology
        </Badge>{" "}
        <Badge variant="outline" color="gray" className="text-gray-400">
          Content
        </Badge>{" "}
        <Badge variant="outline" color="gray" className="text-gray-400">
          webdev
        </Badge>
      </div>
      <div className="flex h-5 items-center justify-between text-sm text-muted-foreground mt-5 ">
        <div className="flex items-center">
          <IconUsersGroup size={20} className="mr-1" />
          10
        </div>
        <Separator orientation="vertical" className="w-[2px]" />
        <div className="flex items-center">
          <IconCoins className="mr-1" />3
        </div>
        <Separator orientation="vertical" className="w-[2px]" />
        <div className="">Due in 1w 2d 8h</div>
        <Separator orientation="vertical" className="w-[2px]" />
        <div className="flex items-center">
          <IconMessageCircle size={20} className="mr-1" />3
        </div>
      </div>
    </Card>
  );
}
