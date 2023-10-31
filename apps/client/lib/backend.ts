import { Api } from './api';
import { getAccessTokenWithFallback } from './utils';

export const backendApi = new Api();
export const backendApiWithAuth = async () => {
  const token = await getAccessTokenWithFallback();
  return new Api({
    baseApiParams: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
