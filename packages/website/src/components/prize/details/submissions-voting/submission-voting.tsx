'use client'
import { api } from '@/trpc/react'
import type { Submissions } from '@/types/submissions'
import type { PrizeStages } from '@viaprize/core/lib/prizes'

import { Separator } from '@viaprize/ui/separator'
import { format } from 'date-fns'

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

        return (
          <SubmissionVotingCard
            contractAddress={contractAddress}
            submissionHash={submission.submissionHash}
            totalVotingAmount={totalVotingAmount?.total ?? 0}
            projectLink={submission.projectLink}
            prizeStage={prizeStage}
            isVoter={isVotingOpen}
            id={submission.submissionHash}
            key={submission.username}
            description={submission.description}
            name={submission.username ?? ''}
            submissionCreated={formattedDate}
            avatar={submission.user?.image ?? ''}
            votes={submission.votes}
            onVoteChange={handleVoteChange}
          />
        )
      })}
      {totalVotingAmount && prizeStage === 'VOTING_OPEN' && (
        <SubmissionVotingCard
          contractAddress={contractAddress}
          submissionHash={totalVotingAmount.refundSubmissionHash}
          totalVotingAmount={totalVotingAmount?.total ?? 0}
          prizeStage={prizeStage}
          isVoter={isVotingOpen}
          id={totalVotingAmount.refundSubmissionHash}
          key={totalVotingAmount.refundSubmissionHash}
          description={'Vote on this submission to refund your funds'}
          name={'Refund'}
          submissionCreated={format(new Date(), 'MMMM dd, yyyy')}
          avatar={''}
          votes={totalVotingAmount.refundVotes}
          onVoteChange={handleVoteChange}
          projectLink={null}
        />
      )}
    </div>
  )
}
