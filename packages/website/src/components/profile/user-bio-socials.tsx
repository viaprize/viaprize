import { IconLink } from '@tabler/icons-react'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Badge } from '@viaprize/ui/badge'
import { Button } from '@viaprize/ui/button'
import Link from 'next/link'
import type React from 'react'
import UserPrizeStatus from '../stats-cards/user-prize-status'

interface UserPrizeStatusItem {
  value: number
  label: string
}

interface UserBioSocialsProps {
  avatar: string
  name: string
  username: string
  bio: string
  skillset: string[]
  userPrizeStatus: UserPrizeStatusItem[]
  links: { href: string; label: string; icon?: React.ReactNode }[]
}

export default function UserBioSocials({
  avatar,
  name,
  username,
  bio,
  skillset,
  userPrizeStatus,
  links,
}: UserBioSocialsProps) {
  return (
    <div className="p-5">
      <div className="lg:flex items-center">
        <Avatar className="h-[70px] w-[70px] lg:h-[120px] lg:w-[120px] ring-2 ring-primary">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="mt-2 lg:mt-0 lg:ml-7">
          <div className="text-lg flex items-center text-card-foreground/90 font-medium">
            <div>{name}</div>
            <Button size="sm" className="ml-6">
              Edit Profile
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">@{username}</div>
          <div className="mt-1 text-sm md:text-base">{bio}</div>
          <div className="text-accent-foreground/80 flex space-x-2 mt-3">
            <div>Skillset:</div>
            <div>
              {skillset.map((skill) => (
                <Badge key={skill} variant="secondary" className="mb-1 mr-2">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Render Links */}
      <div className="flex flex-wrap items-center space-x-1 lg:space-x-5 mt-7 mb-5 text-sm text-muted-foreground">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center hover:text-primary-500 transition-colors"
          >
            {link.icon && <span className="mr-1">{link.icon}</span>}
            {link.label}
          </Link>
        ))}
      </div>

      {/* Passing userPrizeStatus as props to UserPrizeStatus */}
      <UserPrizeStatus userPrizeStatus={userPrizeStatus} />
    </div>
  )
}
