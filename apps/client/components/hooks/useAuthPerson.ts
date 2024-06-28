import { useQuery } from 'react-query';
import useAppUser from './useAppUser';
import { useUser } from './useUser';
import { useParams } from 'next/navigation';

export default function useAuthPerson() {
  const { appUser } = useAppUser();
  const { getUserByUserName } = useUser();
  const params = useParams<{ id: string }>();

  const { data: userData } = useQuery('getCurrentByUserName', () =>
    getUserByUserName(params?.id || ''),
  );

  console.log('userData', userData);
  console.log('appUser', appUser);

  const isProfileOwner = appUser?.authId === userData?.authId;
  return isProfileOwner;
}
