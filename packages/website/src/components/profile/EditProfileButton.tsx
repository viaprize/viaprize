// components/profile/EditProfileButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@viaprize/ui/button'
import { IconEdit } from '@tabler/icons-react'
import { EditProfileModal } from './EditProfileModal'
import { useRouter } from 'next/navigation'

interface EditProfileButtonProps {
  user: {
    name: string
    skillSets: string[]
    image: string
    bio: string
  }
  isCurrentUser: boolean
}

export function EditProfileButton({ user, isCurrentUser }: EditProfileButtonProps) {
  const router = useRouter()

  if (!isCurrentUser) return null

  return (
    <EditProfileModal
      initialData={{
        name: user.name,
        skillSets: user.skillSets || [],
        image: user.image,
        bio: user.bio || ''
      }}
      onSuccess={() => {
        router.refresh()
      }}
      trigger={
        <Button 
          variant="outline" 
          size="sm" 
          className=""
        >
          <IconEdit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      }
    />
  )
}