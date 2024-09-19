import { Badge } from '@viaprize/ui/badge'
import React from 'react'

export default function AboutContent() {
  return (
    <div className="px-3 w-full">
      <div className="w-full flex items-center justify-between ">
        <h1 className="text-lg text-primary">About this Prize</h1>
        <div className="space-x-2 ">
          <Badge variant="outline" className="text-muted-foreground">
            Technology
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            Content
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            Content
          </Badge>
        </div>
      </div>
    </div>
  )
}
