import MainTabsUserProfile from '@/components/userProfile/maintabs';
import Profile from '@/components/userProfile/profile';

export default function UserProfile({ params }: { params: { id: string } }) {
  return (
    <div className="flex md:w-[95vw] flex-col items-center justify-between p-7">
      <Profile params={params} />
      <MainTabsUserProfile params={params} />
    </div>
  );
}
