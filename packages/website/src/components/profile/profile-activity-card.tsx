import {
  IconCoins,
  IconMessageCircle,
  IconUsersGroup,
} from '@tabler/icons-react'
import { Badge } from '@viaprize/ui/badge'
import { Card } from '@viaprize/ui/card'
import { Separator } from '@viaprize/ui/separator'
import Image from 'next/image'

export default function ProfileActivityCard() {
  return (
    <Card className="p-3 flex items-center justify-between">
      <div className="flex items-center space-x-5">
        <Image
          src="https://github.com/shadcn.png"
          width={80}
          height={70}
          alt=""
          className="rounded-md object-cover"
        />
        <div className="">
          <div className="flex items-center space-x-2">
            <h1 className="font-medium text-card-foreground/80">
              Rebuild the text editor in the network society form
            </h1>
            <Badge
              variant="secondary"
              className="text-green-600 px-2 py-1 font-normal"
            >
              Submission Open
            </Badge>
          </div>
          <div className="mt-1 mb-4">
            <Badge variant="outline" color="gray" className="text-gray-400">
              Technology
            </Badge>{' '}
            <Badge variant="outline" color="gray" className="text-gray-400">
              Content
            </Badge>{' '}
            <Badge variant="outline" color="gray" className="text-gray-400">
              webdev
            </Badge>
          </div>
          <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground  ">
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
        </div>
      </div>
      <div className="">
        <div className="text-lg  lg:text-xl text-primary/80 font-medium">
          $80,000
        </div>
      </div>
    </Card>
  )
}
