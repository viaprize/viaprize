import { IconCalendarTime, IconCoins, IconMessageCircle, IconUsersGroup } from '@tabler/icons-react';
import { Badge } from '@viaprize/ui/badge'
import { Card, CardContent } from '@viaprize/ui/card'
import { Separator } from '@viaprize/ui/separator';

import Image from 'next/image'

export default function ExploreCard() {
  return (
    <Card className="rounded-md bg-background shadow-md hover:shadow-lg">
      <Image
        src="https://github.com/shadcn.png"
        width={50}
        height={50}
        objectFit="cover"
        alt=""
        className="h-40 w-full rounded-t-md object-cover"
      />
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-medium">
            <span className="text-green-700 mr-2">$80,000</span>
            USD
          </div>
          <Badge
            variant="secondary"
            color="green"
            className="text-green-600 px-2 py-1 font-normal"
          >
            Submission Open
          </Badge>
        </div>
        <Separator className="h-3px my-2" />
        <div className="text-lg font-semibold">
          Rebuild the text editor in the network society form
        </div>
        <div className="text-primary text-sm font-semibold my-1 ">
          <span className="text-slate-400">by</span> Harsh rajendra sharma
        </div>
        <div className="flex items-center text-sm mt-2 ">
          {" "}
          <IconCalendarTime size={20} className="mr-1" /> Due in: 1w 2d 8h
        </div>
        <div className="mt-2">
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
        <div className="flex h-5 items-center space-x-2 text-sm text-slate-500 mt-3">
          <div className="flex items-center">
            <IconUsersGroup size={20} className="mr-1" />
            10 Pursuers
          </div>
          <Separator orientation="vertical" className='w-[2px]' />
          <div className="flex items-center">
            <IconCoins className="mr-1" />3 Funders
          </div>
          <Separator orientation="vertical" className='w-[2px]' />
          <div className="flex items-center">
            <IconMessageCircle size={20} className="mr-1" />3
          </div>
          {/* <Separator orientation="vertical" />
          <div className="">web development</div> */}
        </div>
      </CardContent>
    </Card>
  );
}
