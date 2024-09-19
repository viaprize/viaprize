import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Button } from '@viaprize/ui/button'
import { Card } from '@viaprize/ui/card'

export default function ContestantsCard() {
  return (
    <Card className="px-3 py-4">
      <div className="text-muted-foreground text-lg font-normal">
        Contestants (1)
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>John Doe</div>
      </div>
      <Button className="mt-5 w-full">Join Contest</Button>
    </Card>
  )
}
