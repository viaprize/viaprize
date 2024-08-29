'use client';
import React from 'react'
import { Sidebar, SidebarBody, SidebarLink } from './sidebar-ui';
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from '@tabler/icons-react';
import {useState} from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";
import Image from 'next/image';

export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-black dark:text-white"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
    </Link>
  );
};
export default function SideNavbarConfigure() {
    const links = [
      {
        label: "Dashboard",
        href: "#",
        icon: (
          <IconBrandTabler className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
      {
        label: "Profile",
        href: "#",
        icon: (
          <IconUserBolt className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
      {
        label: "Settings",
        href: "#",
        icon: (
          <IconSettings className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
      {
        label: "Logout",
        href: "#",
        icon: (
          <IconArrowLeft className="h-5 w-5 flex-shrink-0 text-neutral-700 dark:text-neutral-200" />
        ),
      },
    ];
    const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between mt-5 gap-10">
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-5 gap-6">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div className="bg-black"></div>
      </SidebarBody>
    </Sidebar>
  );
}
