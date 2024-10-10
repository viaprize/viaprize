'use client'
import { useAuth } from '@/hooks/useAuth'
import {
  IconBell,
  IconCirclePlus,
  IconLogin,
  IconLogout,
  IconTrophy,
  IconUser,
  IconWallet,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { Sidebar, SidebarBody, SidebarButton, SidebarLink } from './sidebar-ui'

const Logo = ({ name, image }: { name: string; image: string }) => {
  return (
    <Link href="#" className="relative z-20 flex items-center space-x-3 py-1">
      <Image
        src={image}
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
          <div className="text-lg">{name}</div>
        </div>
      </motion.span>
    </Link>
  )
}

const LogoIcon = ({ image }: { image: string }) => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src={image}
        className="h-[36px] w-[36px] flex-shrink-0 rounded-full"
        width={50}
        height={50}
        alt="Avatar"
      />
    </Link>
  )
}

export default function SideNavbarConfigure() {
  const links = [
    {
      label: 'Prizes',
      href: '/prize',
      icon: <IconTrophy className="h-25 w-25 flex-shrink-0 " />,
    },
    {
      label: 'Create Prize',
      icon: <IconCirclePlus className="h-25 w-25 flex-shrink-0 " />,
      href: '/prize/create',
    },
  ]
  const [open, setOpen] = useState(false)

  const { logOut, session } = useAuth()
  const { isConnected } = useAccount()

  const { disconnectAsync } = useDisconnect()

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody>
        <div
          className={`flex flex-col overflow-y-auto overflow-x-hidden ${
            !open ? 'items-center' : ''
          }`}
        >
          {session?.user &&
            (open ? (
              <Logo
                name={session?.user.username ?? 'John Doe'}
                image={session?.user.image ?? 'https://github.com/shadcn.png'}
              />
            ) : (
              <LogoIcon
                image={session?.user.image ?? 'https://github.com/shadcn.png'}
              />
            ))}
          <div className="mt-4 space-y-2">
            {links.map((link) => (
              <SidebarLink key={link.label} link={link} />
            ))}

            <SidebarButton
              item={{
                icon: session?.user ? (
                  <IconLogout className="h-25 w-25 flex-shrink-0 text-primary-foreground" />
                ) : (
                  <IconLogin className="h-25 w-25 flex-shrink-0 text-primary-foreground" />
                ),
                label: session?.user ? 'Logout' : 'Login',
              }}
              onClick={async () => {
                if (!session?.user) {
                  window.location.href = '/login'
                  return
                }
                await logOut()
              }}
            />
            {isConnected ? (
              <SidebarButton
                item={{
                  icon: (
                    <IconWallet className="h-25 w-25 flex-shrink-0 text-primary-foreground" />
                  ),
                  label: 'Disconnect Wallet',
                }}
                onClick={async () => {
                  await disconnectAsync()
                }}
              />
            ) : null}
          </div>

          {/* Conditionally render buttons only when the sidebar is open */}
          {/* {open ? (
            <>
              <Button className="mt-7 w-[70%]">Create a Prize</Button>
              <Button className="mt-2 w-[70%] text-green-600" variant="outline">
                Create a Fundraiser
              </Button>
            </>
          ) : (
            <IconCirclePlus className="mt-5" />
          )} */}
        </div>
      </SidebarBody>
    </Sidebar>
  )
}
