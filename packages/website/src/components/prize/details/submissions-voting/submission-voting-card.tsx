import type { PrizeStages } from '@viaprize/core/lib/prizes'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Badge } from '@viaprize/ui/badge'
import { Card } from '@viaprize/ui/card'
import { Input } from '@viaprize/ui/input'
import VoteDialog from './vote-dialog'

interface User {
  id: string
  description: string
  name: string
  avatar: string
  submissionCreated: string
  prizeStage: PrizeStages
  contractAddress: string
  votes: number | string
  onVoteChange: (id: string, newVotes: number | string) => void
  isVoter?: boolean
  totalVotingAmount: number
  submissionHash: string
}

export default function SubmissionVotingCard({
  id,
  description,
  name,
  avatar,
  totalVotingAmount,
  submissionCreated,
  votes,
  prizeStage,
  onVoteChange,
  isVoter,
  contractAddress,
  submissionHash,
}: User) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="mr-2">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>
              {name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-primary">{name}</h3>
            <div className="text-muted-foreground text-sm">
              {submissionCreated}
            </div>
            <p>{description}</p>
          </div>
        </div>
        <Badge>Current votes: ${votes}</Badge>
        {isVoter ? (
          <VoteDialog
            contractAddress={contractAddress}
            submissionHash={submissionHash}
            maxVotes={totalVotingAmount}
          />
        ) : null}
      </div>
    </Card>
  )
}
