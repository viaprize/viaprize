import type { selectPrizeType } from '@viaprize/core/database/schema/prizes'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Button } from '@viaprize/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@viaprize/ui/card'
import Image from 'next/image'
import { DeployPrizeButton } from './deploy-prize-button'

export function ProposalCard({
  proposal,
}: { proposal?: selectPrizeType; onDeploy?: (id: string) => void } = {}) {
  if (!proposal) {
    return (
      <Card className="w-full max-w-2xl p-6">
        <p>No proposal data available.</p>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://avatar.vercel.sh/${proposal.authorUsername}`}
              alt={`${proposal.authorUsername}'s avatar`}
            />
            <AvatarFallback>
              {proposal.authorUsername.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{proposal.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              by {proposal.authorUsername}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {proposal.imageUrl && (
          <div
            className="relative w-full"
            style={{ height: '0', paddingBottom: '30%' }}
          >
            <Image
              src={proposal.imageUrl}
              alt={proposal.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        <p className="text-sm line-clamp-3">{proposal.description}</p>
        <Button variant="outline" className="w-full">
          Read More
        </Button>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold">Submission Duration:</p>
            <p>{proposal.startSubmissionDate} days</p>
          </div>
          <div>
            <p className="font-semibold">Voting Start Date:</p>
            <p>{new Date(proposal.startVotingDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="font-semibold">Voting Duration:</p>
            <p>{proposal.votingDurationInMinutes} days</p>
          </div>
          <div>
            <p className="font-semibold">Proposer Address:</p>
            <p className="truncate">{proposal.proposerAddress}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <DeployPrizeButton prizeId={proposal.id} />
      </CardFooter>
    </Card>
  )
}
