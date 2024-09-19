import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@viaprize/ui/card'

export default function VisionaryFunderCard() {
  return (
    <Card className="px-3 py-4">
      <div className="text-muted-foreground text-lg font-normal">Visionary</div>

      <div className="flex items-center space-x-2 mt-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>John Doe</div>
      </div>

      <div className="text-muted-foreground text-lg font-normal mt-5 mb-2">
        Funders (1)
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 ">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>John Doe</div>
        </div>
        <div className="text-primary">$1000</div>
      </div>
    </Card>
  )
}
