import ShouldLogin from '@/components/custom/should-login';
import AppShellLayout from '@/components/layout/appshell';
import MainTabsUserProfile from '@/components/userProfile/maintabs';
import Profile from '@/components/userProfile/profile';
import useAppUser from '@/context/hooks/useAppUser';
import type { ReactElement } from 'react';

export default function UserProfile() {
  const { appUser } = useAppUser();

  if (!appUser) {
    return <ShouldLogin text="You need to login to view your profile" />;
  }

  return (
    <div className="lg:flex md:w-[95vw] flex-col items-center lg:justify-between p-7">
      <Profile />
      <MainTabsUserProfile />
    </div>
  );
}

UserProfile.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
