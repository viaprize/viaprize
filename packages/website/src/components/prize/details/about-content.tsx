import { Badge } from '@viaprize/ui/badge'
import React from 'react'

export default function AboutContent() {
  return (
    <div className="px-3 w-full">
      <div className="w-full lg:flex lg:items-center lg:justify-between  space-y-2 lg:space-y-0">
        <h1 className="text-lg text-primary">About this Prize</h1>
        <div className="space-x-2 ">
          <Badge variant="outline"  className="text-muted-foreground">
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
      <p className='border p-2 mt-3 rounded-md'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in
        vestibulum purus. Nullam nec sapien et turpis tincidunt tempus. Nulla
      </p>
    </div>
  )
}
