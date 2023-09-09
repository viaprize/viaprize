import React from "react";
import { Avatar, Popover, Button, Paper ,Text} from '@mantine/core';
import Link from "next/link";

export default function HeaderLayout  ()  {
  return (
    <div className="bg-black h-[70px]">
      <div className="absolute right-0 m-4">
      <Popover width={200} position="bottom" withArrow shadow="md" >
      <Popover.Target >
      <Avatar />
      </Popover.Target>
      <Popover.Dropdown>
        <Link href="/profile">
     <Text>view Profile</Text>
        </Link>
      </Popover.Dropdown>
    </Popover>
    </div>
    </div>
  )
}

