import DetailHeader from '@/components/prize/details/details-header'
import { IconArrowLeft } from '@tabler/icons-react'

export default function PrizeDetails() {
  return (
    <div className="flex h-full">
      <div className="w-full md:w-[75%] h-full border-r-2">
        <div className="p-3 space-y-3">
          <div className="flex items-center text-sm font-semibold">
            <IconArrowLeft className="mr-1" size={20} /> Back
          </div>
          <DetailHeader />
        </div>
      </div>
      <div className="w-[25%] mt-5 mx-2 md:block hidden">wdufiuew</div>
    </div>
  )
}
