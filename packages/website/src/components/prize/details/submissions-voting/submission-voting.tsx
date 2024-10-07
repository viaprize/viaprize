'use client'
import type { api } from '@/trpc/server'
import type { PrizeStages } from '@viaprize/core/lib/prizes'
import { Button } from '@viaprize/ui/button'
import { Separator } from '@viaprize/ui/separator'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SubmissionVotingCard from './submission-voting-card'

export default function SubmissionVoting({
  prizeStage,
  submissions,
}: {
  submissions: NonNullable<
    Awaited<ReturnType<typeof api.prizes.getPrizeBySlug>>
  >['submissions']
  prizeStage: PrizeStages
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
  const router = useRouter()

  return (
    <div className="p-3">
      {prizeStage === 'VOTING_OPEN' ? (
        <div className="w-full flex items-center justify-between text-xl">
          Submissions ({submissions.length})
          <div>Total voting Points left: {100}</div>
        </div>
      ) : null}

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
            prizeStage={prizeStage}
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

      {prizeStage === 'VOTING_OPEN' && (
        <Button className="mt-3 w-full">Submit All Votes</Button>
      )}
    </div>
  )
}
