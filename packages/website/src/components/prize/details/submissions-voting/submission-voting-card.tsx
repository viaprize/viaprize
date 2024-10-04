import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card } from '@viaprize/ui/card'
import { Input } from '@viaprize/ui/input'

interface User {
  id: number
  description: string
  name: string
  avatar: string
  submissionCreated: string
  votes: number | string
  onVoteChange: (id: number, newVotes: number | string) => void
}

export default function SubmissionVotingCard({
  id,
  description,
  name,
  avatar,
  submissionCreated,
  votes,
  onVoteChange,
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
            <h3 className="text-primary">John Doe</h3>
            <div className="text-muted-foreground text-sm">
              {submissionCreated}
            </div>
            <p>{description}</p>
          </div>
        </div>
        <Input
          placeholder="Enter votes"
          value={votes}
          onChange={(e) => onVoteChange(id, e.target.value)}
          type="number"
          min="0"
          className="w-1/4"
        />
      </div>
    </Card>
  )
}
