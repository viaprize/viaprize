'use client'
import { api } from '@/trpc/react'
import type { Submissions } from '@/types/submissions'
import type { PrizeStages } from '@viaprize/core/lib/prizes'
import { Button } from '@viaprize/ui/button'
import { Separator } from '@viaprize/ui/separator'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import SubmissionVotingCard from './submission-voting-card'

export default function SubmissionVoting({
  prizeStage,
  submissions,
  contractAddress,
}: {
  submissions: Submissions
  prizeStage: PrizeStages
  contractAddress: string
}) {
  const [userVotes, setUserVotes] = useState(
    submissions.map((submission) => ({
      id: submission.submissionHash, // assuming `submission` has a unique `id` field
      votes: 0,
    })),
  )

  const handleVoteChange = (id: string, newVotes: number | string) => {
    const updatedUsers = userVotes.map(
      (user) => (user.id === id ? { ...user, votes: Number(newVotes) } : user), // Ensure votes is a number
    )
    console.log({ updatedUsers })
    if (
      totalVotingAmount &&
      updatedUsers.reduce((acc, user) => acc + user.votes, 0) >
        totalVotingAmount?.total
    ) {
      toast.error('You have exceeded the total voting points')
      return
    }
    setUserVotes(updatedUsers)
  }
  const { data: totalVotingAmount } = api.prizes.getTotalVotingDetail.useQuery(
    { contractAddress },
    {
      enabled: prizeStage === 'VOTING_OPEN',
    },
  )
  const isVotingOpen =
    prizeStage === 'VOTING_OPEN' &&
    totalVotingAmount &&
    totalVotingAmount?.isVoter
  console.log({ totalVotingAmount })

  return (
    <div className="p-3">
      {isVotingOpen ? (
        <div className="w-full flex items-center justify-between text-xl">
          Submissions ({submissions.length})
          <div>Total voting Points left: {totalVotingAmount.total}</div>
        </div>
      ) : null}

      <Separator className="my-2" />
      {submissions.map((submission) => {
        const formattedDate = format(
          new Date(submission.createdAt),
          'MMMM dd, yyyy',
        )
        const userVote = userVotes.find(
          (vote) => vote.id === submission.submissionHash,
        )
        const voteValue = userVote ? userVote.votes : 0

        return (
          <SubmissionVotingCard
            prizeStage={prizeStage}
            isVoter={isVotingOpen}
            id={submission.submissionHash}
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

      {totalVotingAmount?.isVoter && (
        <Button className="mt-3 w-full">Submit All Votes</Button>
      )}
    </div>
  )
}
