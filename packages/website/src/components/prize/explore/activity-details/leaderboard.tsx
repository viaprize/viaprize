'use client'
import {
  IconCaretDownFilled,
  IconChevronDown,
  IconCoin,
  IconMedal,
  IconRosetteNumber1,
  IconSquareNumber1,
  IconSquareNumber1Filled,
  IconRosetteNumber2,
  IconRosetteNumber3,
  IconRosetteNumber4,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@viaprize/ui/avatar";
import { Button } from "@viaprize/ui/button";
import { Card } from "@viaprize/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@viaprize/ui/dropdown-menu";
import { useState } from "react";

interface LeaderboardEntry {
  name: string;
  avatar: string;
  project: string;
  earned: number;
  rank: number;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <IconRosetteNumber1 size={30} stroke={2} color="gold" />;
    case 2:
      return <IconRosetteNumber2 size={30} stroke={2} color="silver" />;
    case 3:
      return <IconRosetteNumber3 size={30} stroke={2} color="brown" />;
    default:
      return <IconRosetteNumber4 size={30} stroke={2} color="gray" />;
  }
};

function Switch() {
  const [position, setPosition] = useState("top");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
          {position === "top"
            ? "Top Pursuer"
            : position === "bottom"
            ? "Top Funder"
            : "Top Visionaries"}{" "}
          <IconChevronDown size={18} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top Pursuer</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">
            Top Funder
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">
            Top Visionaries
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface LeaderboardProps {
  leaderboardEntries: LeaderboardEntry[];
}

export default function Leaderboard({ leaderboardEntries }: LeaderboardProps) {
  return (
    <Card className="bg-slate-50 py-3 text-sm p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium text-lg flex items-center">
          <IconMedal size={30} />
          Leaderboard
        </div>
        <Switch />
      </div>
      <div className="space-y-2 mt-4">
        {leaderboardEntries.map((entry, index) => (
          <div className="flex items-center justify-between py-1" key={index}>
            <div className="flex items-center space-x-2">
              {getRankIcon(entry.rank)}
              <Avatar>
                <AvatarImage src={entry.avatar} alt={entry.name} />
                <AvatarFallback>
                  {entry.name ? entry.name.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>

              <div className="font-semibold">{entry.name}</div>
              <div className="text-[10px] font-medium"></div>
            </div>
            <div className="flex items-center text-md font-semibold text-gray-600">
              <IconCoin size={25} stroke={2} color="green" />
              {entry.earned} earned
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
