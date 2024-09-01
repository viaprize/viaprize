import Image from "next/image";
import Link from "next/link";
import React from "react";
import Search from "./search";

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
    <div className="bg-background flex h-[60px] w-full items-center justify-between px-5 rounded-md">
      <Image
        src="/viaprizeBg.png"
        alt="viaprize logo"
        className="h-10 w-10 flex-shrink-0"
        width={50}
        height={50}
      />
      <div className="flex items-center justify-between space-x-7 font-semibold">
        {header.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="">
        <Search />
      </div>
    </div>
  );
}
