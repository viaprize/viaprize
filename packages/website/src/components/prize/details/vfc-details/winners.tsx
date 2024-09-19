import { Avatar, AvatarImage, AvatarFallback } from '@viaprize/ui/avatar';
import { Card } from '@viaprize/ui/card'
import React from 'react'

export default function Winners() {
  return (
    <Card className="px-3 py-4">
      <div className="text-muted-foreground text-lg font-normal mb-3">
        Winners (1)
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 ">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>John Doe</div>
        </div>
        <div className="text-primary">
          $1000 <span className='text-black'>Won</span>
        </div>
      </div>
    </Card>
  );
}
