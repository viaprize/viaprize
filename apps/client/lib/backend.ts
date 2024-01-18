import { getAccessToken } from '@privy-io/react-auth';
import useAppUserStore from 'store/app-user';
import { Api } from './api';

export const backendApi = async (withoutAuth?: boolean) => {
  const api = new Api();
  const token = await getAccessToken();
  console.log({ token }, 'this is the token');
  if (withoutAuth) {
    return api;
  }
  if (token) {
    return new Api({
      baseApiParams: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }

  if (!token) {
    const user = useAppUserStore.getState().user
    if (user) {
      useAppUserStore.getState().clearUser()
    }
    return api;
  }
  return api;
};
