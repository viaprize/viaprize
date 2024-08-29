import Header from "@/components/layout/header";
import SideNavbarConfigure from "@/components/layout/sidenavbar-configure";
import React from "react";

export default function DashBoardlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100vh] w-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
      {/* Header at the top */}
      <Header />

      {/* Main content area with sidebar and children */}
      <div className="flex h-full">
        {/* Sidebar on the left */}
        <div className="flex-shrink-0">
          <SideNavbarConfigure />
        </div>

        {/* Children content on the right */}
        <div className="flex-1 overflow-auto bg-white p-4 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
}
