'use client';
import { IconCaretDownFilled, IconChevronDown, IconCoin } from '@tabler/icons-react';
import { Button } from '@viaprize/ui/button';
import { Card } from '@viaprize/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@viaprize/ui/dropdown-menu";
import { useState } from 'react';

function Switch(){
     const [position, setPosition] = useState("bottom");
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Top Pursuer <IconChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">
              Top Pursuer
            </DropdownMenuRadioItem>
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



export default function Leaderboard() {
  return (
    <Card className="bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <div className="ttext-gray-400 text-lg">Leaderboard</div>
        <Switch />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          <div className="text-md">
            <div className="text-semibold">John Doe</div>
            <div className="text-gray-400 text-sm">Project Name</div>
          </div>
        </div>
        <div className="flex items-center font-semibold text-md text-gray-600 ">
          {" "}
          <IconCoin size={25} stroke={2} color="green" />
          300 earned
        </div>
      </div>
    </Card>
  );
}
