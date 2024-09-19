import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card } from '@viaprize/ui/card'
import { Input } from '@viaprize/ui/input'
import React from 'react'

// Define the User type
type User = {
  id: number
  name: string
  avatar: string
  submitted: string
  votes: number | string // Allow string for easier input handling
}

// Define the props type for the VotingCard component
type VotingCardProps = {
  user: User
  onVoteChange: (id: number, newVotes: number | string) => void
}

export default function VotingCard({ user, onVoteChange }: VotingCardProps) {
  return (
    <Card className="p-3 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="mr-2">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(' ')
                .map((word) => word[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-primary">{user.name}</h3>
            <div className="text-muted-foreground text-sm">
              Submitted {user.submitted}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter votes"
            value={user.votes}
            onChange={(e) => onVoteChange(user.id, e.target.value)}
            type="number"
            min="0"
          />
        </div>
      </div>
    </Card>
  )
}
