'use client';

import ShouldLogin from '@/components/custom/should-login';
import useAppUser from '@/components/hooks/useAppUser';
import MainTabsUserProfile from '@/components/userProfile/maintabs';
import Profile from '@/components/userProfile/profile';

export default function UserProfile({ params }: { params: { id: string } }) {
  const { appUser } = useAppUser();

  if (!appUser) {
    return <ShouldLogin text="You need to login to view your profile" />;
  }

  return (
    <div className="flex md:w-[95vw] flex-col items-center justify-between p-7">
      <Profile />
      <MainTabsUserProfile params={params} />
    </div>
  );
}
