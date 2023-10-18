import AppShellLayout from "@/components/layout/appshell";
import MainTabsUserProfile from "@/components/userProfile/maintabs";
import Profile from "@/components/userProfile/profile";
import type { ReactElement } from "react";

export default function UserProfile() {
  return (
    <div className="flex">
      <Profile />
      <MainTabsUserProfile />
    </div>
  );
}

UserProfile.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
