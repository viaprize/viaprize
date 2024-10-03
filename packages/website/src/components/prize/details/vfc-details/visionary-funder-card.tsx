import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@viaprize/ui/card'

export default function VisionaryFunderCard({
  name,
  avatar,
  numberOfFunders,
  totalFunds,
}: {
  avatar?: string | null
  name: string
  numberOfFunders: number
  totalFunds: number
}) {
  return (
    <Card className="px-3 py-4">
      <div className="text-muted-foreground text-lg font-normal">Visionary</div>

      <div className="flex items-center space-x-2 mt-2">
        <Avatar className="border">
          <AvatarImage src={avatar ?? undefined} alt="@shadcn" />
          <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>{name}</div>
      </div>

      <div className="text-muted-foreground text-lg font-normal mt-5 mb-2">
        Funders ({numberOfFunders})
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 ">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>{name}</div>
        </div>
        <div className="text-primary">{totalFunds}</div>
      </div>
    </Card>
  )
}
