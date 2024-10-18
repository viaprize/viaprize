import { formatUnderscoreString } from '@/lib/utils'
import {
  IconCoins,
  IconMessageCircle,
  IconUsersGroup,
} from '@tabler/icons-react'
import { Badge } from '@viaprize/ui/badge'
import { Card, CardContent } from '@viaprize/ui/card'
import { Separator } from '@viaprize/ui/separator'

import Image from 'next/image'
import Link from 'next/link'

interface ExploreCardProps {
  imageUrl: string
  title: string
  funds: number
  prizeStage: string
  numberOfContestants: number
  numberOfFunders: number
  numberOfComments: number
  badges?: string[] | null
  href: string
}

export default function ExploreCard(props: ExploreCardProps) {
  return (
    <Link href={props.href} className="block">
      <Card className="p-3 h-full flex flex-col   hover:bg-muted-foreground/10">
        <Image
          src={props.imageUrl}
          width={1250}
          height={1250}
          alt=""
          objectFit="cover"
          className="h-fit w-full rounded-md aspect-video object-cover"
        />
        <div className="w-full pt-4">
          <div className="flex items-center justify-between">
            <div className="text-lg  lg:text-xl text-primary/80 font-medium">
              {props.funds} USD
            </div>
            <Badge
              variant="secondary"
              className="text-green-600 px-2 py-1 font-normal"
            >
              {formatUnderscoreString(props.prizeStage)}
            </Badge>
          </div>
          <Separator className="my-3" />
          <h1 className="font-medium text-card-foreground/80 hover:underline">
            {props.title}
          </h1>

          <div className="mt-1 lg:mt-3 flex flex-wrap gap-1">
            {props.badges?.map((badge) => (
              <Badge key={badge} variant="default">
                {formatUnderscoreString(badge)}
              </Badge>
            ))}
          </div>
          <div className="flex h-5 items-center justify-between text-sm text-muted-foreground mt-5 ">
            <div className="flex items-center">
              <IconUsersGroup size={20} className="mr-1" />
              {props.numberOfContestants}
            </div>
            <Separator orientation="vertical" className="w-[2px]" />
            <div className="flex items-center">
              <IconCoins className="mr-1" />
              {props.numberOfFunders}
            </div>
            <Separator orientation="vertical" className="w-[2px]" />
            <div className="">Due in 1w 2d 8h</div>
            <Separator orientation="vertical" className="w-[2px]" />
            <div className="flex items-center">
              <IconMessageCircle size={20} className="mr-1" />
              {props.numberOfComments}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
