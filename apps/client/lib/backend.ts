import { getAccessToken } from '@privy-io/react-auth';
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
  return api;
};
