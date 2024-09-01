import Image from "next/image";
import Link from "next/link";
import React from "react";
import Search from "./search";
import { Button } from "@viaprize/ui/button";
import { IoNotifications } from "react-icons/io5";
import { BiSolidMessageSquare } from "react-icons/bi";

const header = [
  {
    label: "Explore",
    href: "#",
  },
  {
    label: "About",
    href: "#",
  },
  {
    label: "Contact",
    href: "#",
  },
];

export default function Header() {
  return (
    <div className="hidden bg-background md:flex h-[60px] w-full items-center justify-between px-5 rounded-md">
      <Image
        src="/viaprizeBg.png"
        alt="viaprize logo"
        className="h-10 w-10 flex-shrink-0"
        width={50}
        height={50}
      />
      {/* <div className="flex items-center justify-between space-x-7 font-semibold"></div> */}
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="size-7">
          <BiSolidMessageSquare className="text-lg" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7">
          <IoNotifications className="text-lg" />
        </Button>
        <Search />
      </div>
    </div>
  );
}
