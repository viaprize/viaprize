import { formatUnderscoreString } from '@/lib/utils'
import { Badge } from '@viaprize/ui/badge'
import React from 'react'

export default function AboutContent({
  badges,
  description,
}: {
  badges?: string[] | null
  description: string
}) {
  return (
    <div className="px-3 w-full">
      <div className="w-full lg:flex lg:items-center lg:justify-between  space-y-2 lg:space-y-0">
        <h1 className="text-lg text-primary">About this Prize</h1>
        <div className="space-x-2 ">
          {badges?.map((badge) => (
            <Badge
              key={badge}
              variant="outline"
              className="text-muted-foreground"
            >
              {formatUnderscoreString(badge)}
            </Badge>
          ))}
        </div>
      </div>
      <p className="border p-2 mt-3 rounded-md">{description}</p>
    </div>
  )
}
