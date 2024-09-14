'use client'
import {
  IconCoin,
  IconMedal,
  IconRosetteNumber1,
  IconRosetteNumber2,
  IconRosetteNumber3,
  IconRosetteNumber4,
} from '@tabler/icons-react'
import { Avatar, AvatarFallback, AvatarImage } from '@viaprize/ui/avatar'
import { Card } from '@viaprize/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@viaprize/ui/select'

interface LeaderboardEntry {
  name: string
  avatar: string
  project: string
  earned: number
  rank: number
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <IconRosetteNumber1 size={30} stroke={2} color="gold" />
    case 2:
      return <IconRosetteNumber2 size={30} stroke={2} color="silver" />
    case 3:
      return <IconRosetteNumber3 size={30} stroke={2} color="brown" />
    default:
      return <IconRosetteNumber4 size={30} stroke={2} color="gray" />
  }
}

function Switch() {
  return (
    <Select defaultValue="pursuer">
      <SelectTrigger className="w-[47%]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Fruits</SelectLabel> */}
          <SelectItem value="pursuer">Top Pursuers</SelectItem>
          <SelectItem value="banana">Top Funders</SelectItem>
          <SelectItem value="blueberry">Top Visionaries</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

interface LeaderboardProps {
  leaderboardEntries: LeaderboardEntry[]
}

export default function Leaderboard({ leaderboardEntries }: LeaderboardProps) {
  return (
    <Card className="py-3 text-sm p-3">
      <div className="flex items-center justify-between">
        <div className="text-card-foreground/80 text-lg flex items-center">
          <IconMedal size={30} />
          Leaderboard
        </div>
        <Switch />
      </div>
      <div className="space-y-2 mt-4">
        {leaderboardEntries.map((entry) => (
          <div
            className="flex items-center justify-between py-1"
            key={entry.name}
          >
            <div className="flex items-center space-x-2">
              {getRankIcon(entry.rank)}
              <Avatar>
                <AvatarImage src={entry.avatar} alt={entry.name} />
                <AvatarFallback>
                  {entry.name ? entry.name.charAt(0).toUpperCase() : '?'}
                </AvatarFallback>
              </Avatar>

              <div className="font-semibold">{entry.name}</div>
            </div>
            <div className="flex items-center text-md font-semibold text-gray-600">
              <IconCoin size={25} stroke={2} color="green" />
              {entry.earned} earned
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
