'use client'
import type { api } from '@/trpc/server'
import { Button } from '@viaprize/ui/button'
import { Separator } from '@viaprize/ui/separator'
import { format } from 'date-fns'
import { useState } from 'react'
import SubmissionVotingCard from './submission-voting-card'

export default function SubmissionVoting({
  submissions,
}: {
  submissions: NonNullable<
    Awaited<ReturnType<typeof api.prizes.getPrizeBySlug>>
  >['submissions']
}) {
  const [userVotes, setUserVotes] = useState(
    submissions.map((submission) => ({
      id: 1234, // assuming `submission` has a unique `id` field
      votes: 0,
    })),
  )

  const handleVoteChange = (id: number, newVotes: number | string) => {
    const updatedUsers = userVotes.map(
      (user) => (user.id === id ? { ...user, votes: Number(newVotes) } : user), // Ensure votes is a number
    )
    setUserVotes(updatedUsers)
  }

  return (
    <div className="p-3">
      <div className="w-full flex items-center justify-between text-xl">
        Submissions ({submissions.length})
        <div>Total voting Points left: {100}</div>
      </div>
      <Separator className="my-2" />
      {submissions.map((submission) => {
        const formattedDate = format(
          new Date(submission.createdAt),
          'MMMM dd, yyyy',
        )
        const userVote = userVotes.find((vote) => vote.id === 1234)
        const voteValue = userVote ? userVote.votes : 0

        return (
          <SubmissionVotingCard
            id={1234}
            key={submission.username}
            description={submission.description}
            name={submission.username ?? ''}
            submissionCreated={formattedDate}
            avatar={submission.username ?? ''}
            votes={voteValue}
            onVoteChange={handleVoteChange}
          />
        )
      })}
      <Button className="mt-3 w-full">Submit All Votes</Button>
    </div>
  )
}
