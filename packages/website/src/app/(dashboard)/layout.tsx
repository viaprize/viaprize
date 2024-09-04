import Header from '@/components/layout/header'
import SideNavbarConfigure from '@/components/layout/sidenavbar-configure'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import type React from 'react'
export default async function DashBoardlayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session && !session.user.username) {
    return redirect('/onboard')
  }
  return (
    <div className=" h-dvh w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
      {/* Main content area with sidebar and children */}
      <div className="flex md:flex-row flex-col h-full">
        <SideNavbarConfigure />

        <div className="w-full h-full">
          <header className="sticky top-0 z-50 md:mt-2 mx-2">
            <Header />
          </header>
          {/* Children content on the right */}
          <main className="h-full w-full flex-1 overflow-auto bg-background rounded-md md:mr-2 md:my-2">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
