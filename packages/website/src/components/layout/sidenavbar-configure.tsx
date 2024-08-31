'use client';
import React from 'react'
import { Sidebar, SidebarBody, SidebarLink } from './sidebar-ui';
import { IconBell, IconCirclePlus, IconLogout, IconTrophy, IconUser } from '@tabler/icons-react';
import {useState} from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import Image from 'next/image';
import { Button } from '@viaprize/ui/button';

const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-3 py-1"
    >
      <Image
        src="https://github.com/shadcn.png"
        className="h-25 w-25 flex-shrink-0 rounded-full"
        width={50}
        height={50}
        alt="Avatar"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-black dark:text-white"
      >
        <div className="">
          <div className='text-lg'>John Doe</div>
<div className="text-sm text-gray-400"> Builder, Sponsor</div>
        </div>
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="https://github.com/shadcn.png"
        className="h-[36px] w-[36px] flex-shrink-0 rounded-full"
        width={50}
        height={50}
        alt="Avatar"
      />
    </Link>
  );
};

export default function SideNavbarConfigure() {
    const links = [
      {
        label: "Prizes",
        href: "#",
        icon: (
          <IconTrophy className="h-25 w-25 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
      {
        label: "Fundraisers",
        href: "#",
        icon: (
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.39941 20.2384H9.0097C9.35004 20.2384 9.6883 20.2789 10.0182 20.3599L12.7763 21.0301C13.3748 21.1759 13.9982 21.1901 14.6029 21.0727L17.6524 20.4794C18.458 20.3224 19.199 19.9367 19.7798 19.3718L21.9373 17.273C22.5534 16.6746 22.5534 15.7037 21.9373 15.1043C21.3826 14.5647 20.5041 14.504 19.8765 14.9616L17.362 16.7961C17.0019 17.0594 16.5637 17.2011 16.1131 17.2011H13.6849L15.2305 17.201C16.1016 17.201 16.8073 16.5146 16.8073 15.6672V15.3604C16.8073 14.6568 16.315 14.0432 15.6135 13.8731L13.228 13.293C12.8398 13.1988 12.4422 13.1513 12.0426 13.1513C11.0777 13.1513 9.33131 13.9501 9.33131 13.9501L6.39941 15.1761M2.39941 14.7513L2.39941 20.5513C2.39941 21.1113 2.39941 21.3913 2.50841 21.6053C2.60428 21.7934 2.75726 21.9464 2.94542 22.0423C3.15933 22.1513 3.43936 22.1513 3.99941 22.1513H4.79941C5.35947 22.1513 5.63949 22.1513 5.8534 22.0423C6.04157 21.9464 6.19455 21.7934 6.29042 21.6053C6.39941 21.3913 6.39941 21.1113 6.39941 20.5513V14.7513C6.39941 14.1912 6.39941 13.9112 6.29042 13.6973C6.19455 13.5091 6.04157 13.3561 5.8534 13.2603C5.63949 13.1513 5.35947 13.1513 4.79941 13.1513H3.99941C3.43936 13.1513 3.15934 13.1513 2.94542 13.2603C2.75726 13.3561 2.60428 13.5091 2.50841 13.6973C2.39941 13.9112 2.39941 14.1912 2.39941 14.7513ZM17.5908 3.74352C16.994 2.49466 15.618 1.83305 14.2798 2.47164C12.9417 3.11022 12.3716 4.62464 12.9319 5.95409C13.2781 6.77572 14.2702 8.37126 14.9775 9.47029C15.2389 9.87637 15.3695 10.0794 15.5604 10.1982C15.7241 10.3001 15.9291 10.355 16.1218 10.3486C16.3465 10.3412 16.5612 10.2307 16.9906 10.0097C18.1527 9.41158 19.8096 8.52581 20.5202 7.98739C21.6702 7.11618 21.955 5.51484 21.0941 4.2975C20.2332 3.08017 18.7321 2.96038 17.5908 3.74352Z"
              stroke="#373737"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Notifications",
        href: "#",
        icon: (
          <IconBell className="h-25 w-25 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
      {
        label: "Dashboard",
        href: "#",
        icon: (
          <IconUser className="h-25 w-25 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
      {
        label: "Logout",
        href: "#",
        icon: (
          <IconLogout className="h-25 w-25 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
    ];
    const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className={open ? "" : "flex flex-col items-center"}>
     
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-4 space-y-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        
        {/* Conditionally render buttons only when the sidebar is open */}
        {open ? (
          <>
            <Button className="mt-7 w-[70%]">Create a Prize</Button>
            <Button className="mt-2 w-[70%] text-green-600" variant="outline">
              Create a Fundraiser
            </Button>
          </>
        ) : (
          <IconCirclePlus className='mt-5'/>
        )}
      </SidebarBody>
    </Sidebar>
  );
}
