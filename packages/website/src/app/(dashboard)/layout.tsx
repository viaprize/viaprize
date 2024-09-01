import Header from '@/components/layout/header'
import SideNavbarConfigure from '@/components/layout/sidenavbar-configure'
import type React from 'react'

export default function DashBoardlayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" h-dvh w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
      {/* Header at the top */}
      {/* <header className="sticky top-0 z-50 mt-2 mx-2">
        <Header />
      </header> */}

      {/* Main content area with sidebar and children */}
      <div className="flex md:flex-row flex-col h-full">
        {/* Sidebar on the left */}
        {/* <nav className="flex-shrink-0 m-2 "> */}
          <SideNavbarConfigure />
        {/* </nav> */}

        {/* Children content on the right */}
        <main className="h-full w-full flex-1 overflow-auto bg-background  rounded-md md:mr-2 md:my-2">
          {children}
        </main>
      </div>
    </div>
  )
}
