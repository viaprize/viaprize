import Header from '@/components/layout/header'
import SideNavbarConfigure from '@/components/layout/sidenavbar-configure'
import { auth } from '@/server/auth'
import { ScrollArea } from '@viaprize/ui/scroll-area'
import { redirect } from 'next/navigation'
import type React from 'react'

export default async function DashBoardlayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session && !session.user.username) {
    redirect('/onboard')
  }
  return (
    <div className="h-dvh w-full overflow-hidden bg-slate-100">
      <header className="sticky top-0 z-50 md:mt-2 mx-2">
        <Header />
      </header>
      {/* Main content area with sidebar and children */}
      <div className="flex md:flex-row flex-col h-full">
        <SideNavbarConfigure />

        {/* Children content on the right */}
        <ScrollArea className=" h-[calc(100dvh-61px)] flex-1  bg-background rounded-md md:mx-2 md:my-2 ">
          {children}
        </ScrollArea>
      </div>
    </div>
  )
}
