import ListStory from '@/components/about/list-story'
import StayTuned from '@/components/about/stay-tuned'
import TeamContent from '@/components/about/team-content'
import React from 'react'

export default function About() {
  return (
    <div className="px-7 py-20 space-y-20 bg-background">
      <ListStory />
      <TeamContent />
      <StayTuned />
    </div>
  )
}
