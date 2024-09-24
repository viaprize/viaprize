import { auth } from '@/server/auth'
import { IconPresentation } from '@tabler/icons-react'
import type { PrizeStages } from '@viaprize/core/lib/prizes'
import { AspectRatio } from '@viaprize/ui/aspect-ratio'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Badge } from '@viaprize/ui/badge'
import { Button } from '@viaprize/ui/button'
import Image from 'next/image'
import DonateCard from './donate-card'
import SubmitWorkButton from './submissions/submit-work-button'

async function SubmitButton({
  stage,
  prizeId,
}: {
  stage: PrizeStages
  prizeId: string
}) {
  const session = await auth()
  if (!session?.user) {
    return <Badge>Please sign in to submit your work</Badge>
  }
  if (!session.user.username) {
    return <Badge>Please complete your profile to submit your work</Badge>
  }
  const handleSubmitView = () => {
    switch (stage) {
      case 'SUBMISSIONS_OPEN':
        return <SubmitWorkButton prizeId={prizeId} />
      default:
        return <Badge>Submission Closed</Badge>
    }
  }
  return <>{handleSubmitView()}</>
}
export default async function DetailsHeader({
  funds,
  projectName,
  image,
  avatar,
  name,
  stage,
  title,
  prizeId,
}: {
  projectName: string
  image?: string | null
  avatar?: string | undefined
  name: string
  stage: PrizeStages
  funds: number
  title: string
  prizeId: string
}) {
  return (
    <div className="p-3 w-full lg:flex space-x-0 space-y-3 lg:space-y-0 lg:space-x-5">
      <Image
        src={
          image ||
          'https://placehold.jp/24/3d4070/ffffff/1280x720.png?text=No%20Image'
        }
        quality={100}
        width={150}
        height={100}
        className="w-full lg:w-auto rounded-md object-cover"
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

          <SubmitButton stage={stage as PrizeStages} prizeId={prizeId} />
        </div>
      </div>

      <div className="w-full">
        <DonateCard
          projectImage={image ?? ''}
          funds={funds}
          projectName={projectName}
        />
      </div>
    </div>
  )
}
