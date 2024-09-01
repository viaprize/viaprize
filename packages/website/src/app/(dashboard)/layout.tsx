import Header from "@/components/layout/header";
import SideNavbarConfigure from "@/components/layout/sidenavbar-configure";
import type React from "react";

export default function DashBoardlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100vh] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-900">
      {/* Header at the top */}
      <header className="sticky top-0 z-50 mt-3 mx-3">
        <Header />
      </header>

      {/* Main content area with sidebar and children */}
      <div className="flex h-full">
        {/* Sidebar on the left */}
        <div className="flex-shrink-0 m-3 ">
          <SideNavbarConfigure />
        </div>

        {/* Children content on the right */}
        <div className="h-full w-full flex-1 overflow-auto bg-background  rounded-md mr-3 my-3">
          {children}
        </div>
      </div>
    </div>
  );
}
