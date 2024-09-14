import { IconBulb, IconCoin } from '@tabler/icons-react'
import { Card } from '@viaprize/ui/card'
import { Separator } from '@viaprize/ui/separator'

export default function OverallPrizeStatus() {
  return (
    <Card className="divide-x-2 flex items-center space-x-2  divide-gray-300 rounded-lg py-3 w-full">
      <div className="flex items-center space-x-2 p-3">
        <IconCoin size={35} stroke={2} color="green" />
        <div className="text-md">
          $80,000
          <div className="text-sm text-gray-400">Total Prize Pool</div>
        </div>
      </div>
      <div className="flex items-center space-x-2 p-3">
        <IconBulb size={35} stroke={2} color="green" />
        <div className="text-md">
          300
          <div className="text-sm text-gray-400">Ideas Listed</div>
        </div>
      </div>
    </Card>
  )
}
