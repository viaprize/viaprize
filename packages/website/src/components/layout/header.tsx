import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const header = [
  {
    label: 'Explore',
    href: '#',
  },
  {
    label: 'About',
    href: '#',
  },
  {
    label: 'Contact',
    href: '#',
  },
]

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
        <div className="relative flex w-full items-center overflow-hidden rounded-2xl border p-2 focus-within:shadow-lg">
          <div className="grid h-full place-items-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="gray"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            className="peer h-full w-full px-2 text-sm bg-slate-50 text-gray-700 outline-none"
            type="text"
            id="search"
            placeholder="Search "
          />
        </div>
      </div>
    </div>
  );
}
