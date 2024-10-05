'use client'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/trpc/react'
import { Button } from '@viaprize/ui/button'
import React from 'react'
export default function EndSubmissionAndStartVotingButton({
  prizeContractAddress,
}: {
  prizeContractAddress: string
}) {
  const { mutateAsync: endSubmissionAndStartVoting, isPending } =
    api.prizes.endSubmissionAndStartVoting.useMutation()

  return (
    <Button
      onClick={async () =>
        await endSubmissionAndStartVoting({
          contractAddress: prizeContractAddress,
        })
      }
      disabled={isPending}
    >
      End Submission And Start Voting
    </Button>
  )
}
