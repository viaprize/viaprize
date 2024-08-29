import Link from 'next/link';
import React from 'react'
import Image from 'next/image';

const header =[
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
     
]




export default function Header(){
  return (
    <div className="flex h-[70px] w-full justify-between p-3">
      <Image
        src="https://github.com/shadcn.png"
        alt="Acet Labs"
        className="h-10 w-10 flex-shrink-0 rounded-full"
        width={50}
        height={50}
       
      />
      <div className="flex items-center justify-between gap-3">
        {header.map((item, index) => (
          <Link key={index} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
      
    </div>
  );
}
