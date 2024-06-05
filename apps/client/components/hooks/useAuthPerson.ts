import { useQuery } from 'react-query';
import useAppUser from './useAppUser';
import { useUser } from './useUser';

export default function useAuthPerson() {
  const { appUser } = useAppUser();
  const { getUserByUserName } = useUser();

  const { data: userData, refetch: fetchUser } = useQuery('getCurrentByUserName', () =>
    getUserByUserName(appUser?.username || ''),
  );

  const isProfileOwner = appUser?.id === userData?.authId;
  return isProfileOwner;
}
