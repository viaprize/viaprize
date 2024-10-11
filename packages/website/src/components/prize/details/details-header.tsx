import { formatUnderscoreString } from '@/lib/utils'
import { auth } from '@/server/auth'
import { IconPresentation } from '@tabler/icons-react'
import type { PrizeStages } from '@viaprize/core/lib/prizes'
import { AspectRatio } from '@viaprize/ui/aspect-ratio'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Badge } from '@viaprize/ui/badge'
import { Button } from '@viaprize/ui/button'
import { format } from 'date-fns'
import Image from 'next/image'
import DonateCard from './donate-card'

interface DetailsHeaderProps {
  projectName: string
  image?: string | null
  avatar?: string
  name: string
  stage: PrizeStages
  funds: number
  title: string
  contractAddress: string
  prizeId: string
  startSubmissionDate?: string // ISO string or Date
  startVotingDate?: string // ISO string or Date
  submissionDurationInMinutes?: number
  votingDurationInMinutes?: number
}

export default function DetailsHeader({
  funds,
  projectName,
  image,
  avatar,
  name,
  stage,
  title,
  prizeId,
  contractAddress,
  startSubmissionDate,
  startVotingDate,
  submissionDurationInMinutes,
  votingDurationInMinutes,
}: DetailsHeaderProps) {
  // Helper function to format dates as "Month Day, Year"
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return format(date, 'MMMM d, yyyy') // e.g., January 1, 2024
  }

  // Helper function to format minutes into "Xd Xh Xm"
  const formatDuration = (totalMinutes: number) => {
    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60

    const parts = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)

    return parts.join(' ') || '0m'
  }

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
            <AvatarImage src={avatar ?? undefined} alt={name} />
            <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {name}
        </h3>

        <Badge variant="secondary" className="mt-2 text-sm text-primary">
          {formatUnderscoreString(stage || '')}
        </Badge>

        {/* Conditional Rendering Based on Stage */}
        <div className="mt-4 space-y-2">
          {stage === 'NOT_STARTED' && startSubmissionDate && (
            <div className="flex items-center">
              <IconPresentation className="mr-2" />
              <span>
                Submission starts on: {formatDate(startSubmissionDate)}
              </span>
            </div>
          )}

          {stage === 'SUBMISSIONS_OPEN' && (
            <>
              {submissionDurationInMinutes !== undefined && (
                <div className="flex items-center">
                  <IconPresentation className="mr-2" />
                  <span>
                    Submission ends in:{' '}
                    {formatDuration(submissionDurationInMinutes)}
                  </span>
                </div>
              )}
              {startVotingDate && (
                <div className="flex items-center">
                  <IconPresentation className="mr-2" />
                  <span>Voting starts on: {formatDate(startVotingDate)}</span>
                </div>
              )}
            </>
          )}

          {stage === 'VOTING_OPEN' && votingDurationInMinutes !== undefined && (
            <div className="flex items-center">
              <IconPresentation className="mr-2" />
              <span>
                Voting ends in: {formatDuration(votingDurationInMinutes)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <DonateCard
          contractAddress={contractAddress}
          projectImage={image ?? ''}
          funds={funds}
          projectName={projectName}
        />
      </div>
    </div>
  )
}
