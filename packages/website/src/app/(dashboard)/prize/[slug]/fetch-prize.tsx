'use client'
import AboutContent from '@/components/prize/details/about-content'
import EndSubmissionAndStartVotingButton from '@/components/prize/details/buttons/end-submission-and-start-voting-button'
import EndVotingButton from '@/components/prize/details/buttons/end-voting-button'
import StartSubmissionButton from '@/components/prize/details/buttons/start-submission-button'
import DetailHeader from '@/components/prize/details/details-header'
import SubmissionVoting from '@/components/prize/details/submissions-voting/submission-voting'
import ContestantsCard, {
  type ContestantStage,
} from '@/components/prize/details/vfc-details/contestants-card'
import VisionaryFunderCard from '@/components/prize/details/vfc-details/visionary-funder-card'
import Winners from '@/components/prize/details/vfc-details/winners'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/server/auth'
import { api } from '@/trpc/react'

import { IconArrowLeft } from '@tabler/icons-react'
import { Separator } from '@viaprize/ui/separator'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default function FetchPrize({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const { data: prize } = api.prizes.getPrizeBySlug.useQuery(slug)
  const { session } = useAuth()
  if (!prize || !prize.primaryContractAddress) {
    return null
  }

  return (
    <div className="lg:flex h-full">
      <div className="w-full space-y-3 md:w-[75%] h-full lg:max-h-screen overflow-auto border-r-2">
        <div className="flex items-center text-sm font-semibold ml-3 mt-3">
          <IconArrowLeft className="mr-1" size={20} /> Back
        </div>

        <DetailHeader
          contractAddress={prize.primaryContractAddress}
          funds={prize.funds}
          projectName={prize.title}
          name={prize.author.name ?? prize.authorUsername}
          stage={prize.stage}
          image={prize.imageUrl}
          avatar={prize.author.image || ''}
          title={prize.title}
          prizeId={prize.id}
        />
        <Separator className="my-2" />
        <AboutContent badges={['Technology']} description={prize.description} />
        <SubmissionVoting
          prizeStage={prize.stage}
          contractAddress={prize.primaryContractAddress}
          submissions={prize.submissions}
        />

        {prize.primaryContractAddress && session && session.user.isAdmin ? (
          <>
            <StartSubmissionButton
              prizeContractAddress={prize.primaryContractAddress}
            />
            <EndSubmissionAndStartVotingButton
              prizeContractAddress={prize.primaryContractAddress}
            />
            <EndVotingButton
              prizeContractAddress={prize.primaryContractAddress}
            />
          </>
        ) : null}
      </div>
      <div className="w-full lg:w-[25%] mt-5 mx-3 space-y-5 lg:max-h-screen lg:overflow-auto">
        <Winners />
        <VisionaryFunderCard
          name={prize.author.name ?? prize.authorUsername}
          numberOfFunders={prize.numberOfFunders}
          totalFunds={prize.funds}
          avatar={prize.author.image}
        />
        <ContestantsCard
          prizeStage={prize.stage}
          prizeId={prize.id}
          slug={slug}
          totalFunds={prize.funds}
        />
      </div>
    </div>
  )
}
