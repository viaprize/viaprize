import AboutContent from '@/components/prize/details/about-content'
import DetailHeader from '@/components/prize/details/details-header'
import Submissions from '@/components/prize/details/submissions/submissions'
import ContestantsCard from '@/components/prize/details/vfc-details/contestants-card'
import VisionaryFunderCard from '@/components/prize/details/vfc-details/visionary-funder-card'
import Winners from '@/components/prize/details/vfc-details/winners'
import VotingSection from '@/components/prize/details/voting/voting-section'
import { api } from '@/trpc/server'

import { IconArrowLeft } from '@tabler/icons-react'
import { Separator } from '@viaprize/ui/separator'

export default async function PrizeDetails({
  params: { slug },
}: {
  params: { slug: string }
}) {
  console.log('slug', slug)
  const prize = await api.prizes.getPrizeBySlug(slug)
  if (!prize) {
    return <div>Prize not found</div>
  }

  return (
    <div className="lg:flex h-full">
      {/* Adjust this div to be scrollable on mobile */}
      <div className="w-full md:w-[75%] h-full lg:max-h-screen overflow-auto border-r-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm font-semibold ml-3 mt-3">
            <IconArrowLeft className="mr-1" size={20} /> Back
          </div>
          <DetailHeader
            name={prize.author.name ?? prize.authorUsername}
            stage={prize.stage ?? ''}
            image={prize.imageUrl}
            avatar={prize.author.avatar}
          />
          <Separator className="my-2" />
          <AboutContent
            badges={['Technology']}
            description={prize.description}
          />
          <Submissions />
          <VotingSection />
        </div>
      </div>
      <div className="w-full lg:w-[25%] mt-5 mx-3 space-y-5 lg:max-h-screen lg:overflow-auto">
        <Winners />
        <VisionaryFunderCard
          name={prize.author.name ?? prize.authorUsername}
          numberOfFunders={prize.numberOfFunders}
          totalFunds={prize.funds}
          avatar={prize.author.avatar}
        />
        <ContestantsCard name={'Contestant 1'} numberOfContestants={1} />
      </div>
    </div>
  )
}
