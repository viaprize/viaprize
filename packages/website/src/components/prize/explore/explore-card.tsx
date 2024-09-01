import { Badge } from '@viaprize/ui/badge'
import { Card, CardContent } from '@viaprize/ui/card'
import { Progress } from '@viaprize/ui/progress'
import Image from 'next/image'

export default function ExploreCard() {
  return (
    <Card className="rounded-md">
      <Image
        src="https://github.com/shadcn.png"
        width={50}
        height={50}
        objectFit="cover"
        alt=""
        className="h-40 w-full rounded-t-md"
      />
      <div className="p-3">
        <div className="flex text-lg">
          <span className="text-green-700 mr-2">$80,000</span>
          Raised
        </div>
        <Progress value={60} className="w-full my-2" />

        <div className="text-md font-bold">Title</div>
        <Badge>Badge</Badge>
        <div className="text-gray-500 text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
          officiis, quos officia quasi esse illum voluptates blanditiis beatae
          aut pariatur earum libero quisquam cum harum dolores ab sint. Minus,
          maxime.
        </div>
      </div>
    </Card>
  )
}
