'use client'
import { Button } from '@viaprize/ui/button'
import { Separator } from '@viaprize/ui/separator'
import { useState } from 'react'
import VotingCard from './voting-card'

// Define the type for a user
type User = {
  id: number
  name: string
  avatar: string
  submitted: string
  votes: number | string // Allowing string for easier handling with inputs
}

// Array of example users and votes
const examples: User[] = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://github.com/shadcn.png',
    submitted: '2 days ago',
    votes: 0,
  },
  {
    id: 2,
    name: 'Jane Smith',
    avatar: 'https://github.com/janesmith.png',
    submitted: '5 days ago',
    votes: 0,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    avatar: 'https://github.com/alicejohnson.png',
    submitted: '1 day ago',
    votes: 0,
  },
]

export default function VotingSection() {
  const [users, setUsers] = useState<User[]>(examples) // Array of User objects
  const [totalVotesLeft, setTotalVotesLeft] = useState<number>(100) // Total votes left as a number

  // Function to handle vote input changes
  const handleVoteChange = (id: number, newVotes: number | string) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, votes: newVotes } : user,
    )
    setUsers(updatedUsers)
  }

  // Function to handle the final vote submission
  const handleFinalVoteSubmit = () => {
    let totalVotes = 0
    users.forEach(
      (user) => (totalVotes += Number.parseInt(user.votes as string) || 0),
    )

    // Check if votes are within allowed total votes
    if (totalVotes <= 100) {
      console.log('Submitted votes for all users:', users)
      setTotalVotesLeft(100 - totalVotes) // Update the total votes left
    } else {
      alert('Total votes exceed the allowed limit of 100.')
    }
  }

  return (
    <div className="p-3">
      <div className="w-full flex items-center justify-between text-xl">
        <div className="">Voting ({users.length})</div>
        <div className="">Total voting Points left: {totalVotesLeft}</div>
      </div>
      <Separator className="my-2" />

      {/* Map over users and render VotingCard for each */}
      {users.map((user) => (
        <VotingCard key={user.id} user={user} onVoteChange={handleVoteChange} />
      ))}

      {/* Final vote submission button */}
      <Button className="mt-3 w-full" onClick={handleFinalVoteSubmit}>
        Submit All Votes
      </Button>
    </div>
  )
}
