import type { UpdateUser } from '@/lib/api';
import { backendApi } from '@/lib/backend';

interface UpdateUserDtoWithUserName extends UpdateUser {
  userName: string;
}

export const useUser = () => {
  const updateUser = async (updateUserDTO: UpdateUserDtoWithUserName) => {
    console.log(updateUser, 'updateUser');
    const { userName, ...propertiesToUpdate } = updateUserDTO;
    const user = await (
      await backendApi()
    ).users.updateCreate(updateUserDTO.userName, propertiesToUpdate);
    return user.data;
  };

  const getUserByUserName = async (userName: string) => {
    const user = await (await backendApi()).users.usernameDetail(userName);
    return user.data;
  };

  return { updateUser, getUserByUserName };
};
