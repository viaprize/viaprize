import { IconPresentation } from '@tabler/icons-react'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Badge } from '@viaprize/ui/badge'
import { Button } from '@viaprize/ui/button'
import Image from 'next/image'
import DonateCard from './donate-card'

export default function DetailHeader({
  image,
  avatar,
  name,
  stage,
  title,
}: {
  image?: string | null
  avatar?: string | null
  name: string
  stage: string
  title: string
}) {
  return (
    <div className="p-3 w-full lg:flex space-x-0 space-y-3 lg:space-y-0 lg:space-x-5">
      <Image
        src={
          image ||
          'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
        }
        width={150}
        height={100}
        className="rounded-md w-full lg:w-auto"
        alt="Image"
      />

      <div className="w-full">
        <h1 className="text-2xl">{title}</h1>

        <h3 className="text-lg text-primary flex items-center mt-1">
          <Avatar className="mr-2">
            <AvatarImage src={avatar ?? undefined} alt="@shadcn" />
            <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {name}
        </h3>
        <div className="mt-2 flex items-center space-x-3">
          <Badge variant="secondary" className="text-sm text-primary ">
            {stage}
          </Badge>
          <Button size="sm">
            <IconPresentation className="mr-2" size={20} />
            Submit your work
          </Button>
        </div>
      </div>

      <div className="w-full">
        <DonateCard title={title} />
      </div>
    </div>
  )
}
