import ShouldLogin from '@/components/custom/should-login';
import useAppUser from '@/components/hooks/useAppUser';
import AppShellLayout from '@/components/layout/appshell';
import MainTabsUserProfile from '@/components/userProfile/maintabs';
import Profile from '@/components/userProfile/profile';
import type { ReactElement } from 'react';

export default function UserProfile() {
  const { appUser } = useAppUser();

  if (!appUser) {
    return <ShouldLogin text="You need to login to view your profile" />;
  }

  return (
    <div className="md:flex md:w-[95vw] justify-between p-7">
      <Profile />
      <MainTabsUserProfile />
    </div>
  );
}

UserProfile.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};
