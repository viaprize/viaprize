import AboutContent from '@/components/prize/details/about-content'
import DetailHeader from '@/components/prize/details/details-header'
import VisionaryFunderCard from '@/components/prize/details/visionary-funder-card'
import { IconArrowLeft } from '@tabler/icons-react'
import { Separator } from '@viaprize/ui/separator'

export default function PrizeDetails() {
  return (
    <div className="flex h-full">
      <div className="w-full md:w-[75%] h-full border-r-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm font-semibold ml-3 mt-3">
            <IconArrowLeft className="mr-1" size={20} /> Back
          </div>
          <DetailHeader />
          <Separator className='my-2'/>
          <AboutContent />
        </div>
      </div>
      <div className="w-[25%] mt-5 mx-2 md:block hidden">
        <VisionaryFunderCard />
      </div>
    </div>
  )
}
