'use client'
import LoaderCircle from '@/components/common/loader-circle'
import AboutContent from '@/components/prize/details/about-content'
import EarlyDisputeButton from '@/components/prize/details/buttons/early-dispute-button'
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
import type { Submissions } from '@/types/submissions'

import { IconArrowLeft } from '@tabler/icons-react'
import { Separator } from '@viaprize/ui/separator'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default function FetchPrize({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const [prize] = api.prizes.getPrizeBySlug.useSuspenseQuery(slug)
  const { session } = useAuth()
  if (!prize || !prize.primaryContractAddress) {
    return null
  }

  return (
    <Suspense fallback={<LoaderCircle />}>
      <div className="lg:flex flex-1 ">
        <div className="w-full space-y-3 md:w-[75%]  overflow-y-auto py-4 border-r-2">
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
            startSubmissionDate={prize.startSubmissionDate}
            startVotingDate={prize.startVotingDate}
            submissionDurationInMinutes={prize.submissionDurationInMinutes}
            votingDurationInMinutes={prize.votingDurationInMinutes}
          />
          <Separator className="my-2" />
          <AboutContent
            badges={prize.skillSets}
            description={prize.description}
          />
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
              <EarlyDisputeButton
                prizeContractAddress={prize.primaryContractAddress}
              />
            </>
          ) : null}
        </div>
        <div className="w-full lg:w-[25%] py-5 px-3 space-y-5 ">
          <Winners
            submissions={prize.submissions as Submissions}
            prizeStage={prize.stage}
          />
          <VisionaryFunderCard
            slug={slug}
            prizeId={prize.id}
            name={prize.author.name ?? prize.authorUsername}
            numberOfFunders={prize.numberOfFunders}
            totalFunds={prize.funds}
            avatar={prize.author.image}
          />
          <ContestantsCard
            submissions={prize.submissions}
            prizeStage={prize.stage}
            prizeId={prize.id}
            slug={slug}
            totalFunds={prize.funds}
          />
        </div>
      </div>
    </Suspense>
  )
}
