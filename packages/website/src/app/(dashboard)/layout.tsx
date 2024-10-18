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
    <div className="h-dvh w-full  bg-slate-100 p-3">
      <header>
        <Header />
      </header>
      {/* Main content area with sidebar and children */}
      <div className="flex md:flex-row flex-col flex-1">
        <SideNavbarConfigure />

        <div className="mt-2 ml-2 flex-1 h-[calc(100vh-90px)]  bg-background rounded-md  overflow-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}
