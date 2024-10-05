'use client'
import { useAuth } from '@/hooks/useAuth'
import { getContestantStage } from '@/lib/utils'
import { api } from '@/trpc/react'
import type { PrizeStages } from '@viaprize/core/lib/prizes'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card } from '@viaprize/ui/card'
import { Suspense } from 'react'
import SubmitWorkButton from '../submissions-voting/submit-work-button'
import JoinContestantButton from './join-contestant-button'
export type ContestantStage = 'NOT_JOINED' | 'JOINED' | 'SUBMITTED' | 'LOGIN'
export type Contestants = typeof api.prizes.getContestants.useQuery
function ContestantCardButton({
  stage,
  prizeId,
  prizeStage,
  slug,
  totalFunds,
}: {
  stage: ContestantStage
  prizeId: string
  slug: string
  prizeStage: PrizeStages
  totalFunds: number
}) {
  return (
    <>
      {(() => {
        switch (stage) {
          case 'NOT_JOINED':
            return <JoinContestantButton prizeId={prizeId} slug={slug} />
          case 'JOINED':
            return (
              <SubmitWorkButton
                totalFunds={totalFunds}
                prizeStage={prizeStage}
                prizeId={prizeId}
              />
            )
          case 'SUBMITTED':
            return null
        }
      })()}
    </>
  )
}
export default function ContestantsCard({
  prizeId,
  slug,
  prizeStage,
  totalFunds,
}: {
  prizeId: string
  slug: string
  prizeStage: PrizeStages
  totalFunds: number
}) {
  const [contestants] = api.prizes.getContestants.useSuspenseQuery(prizeId)
  const { session } = useAuth()
  const contestantStage = getContestantStage<(typeof contestants)[number]>(
    contestants,
    session?.user.username,
  )
  return (
    <Suspense fallback={<Card className="px-3 py-4">Loading...</Card>}>
      <Card className="px-3 py-4">
        <div className="text-muted-foreground text-lg font-normal">
          Contestants ({contestants?.length})
        </div>
        {contestants?.map((contestant) => (
          <div
            className="flex items-center space-x-2 my-4"
            key={contestant.username}
          >
            <Avatar>
              <AvatarImage
                src={contestant.user.image ?? undefined}
                alt={contestant.username.substring(0, 2)}
              />
              <AvatarFallback>
                {contestant.username.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>{contestant.username}</div>
          </div>
        ))}
        <ContestantCardButton
          totalFunds={totalFunds}
          prizeStage={prizeStage}
          stage={contestantStage}
          prizeId={prizeId}
          slug={slug}
        />
      </Card>
    </Suspense>
  )
}
