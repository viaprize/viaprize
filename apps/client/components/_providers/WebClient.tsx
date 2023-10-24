import { env } from '@env';
import { Web3Storage } from 'web3.storage';

function getAccessToken() {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return env.NEXT_PUBLIC_WEB3_STORAGE;
}

export function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}
