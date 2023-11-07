/**
 * Sleeps for the specified duration.
 * @param ms - The duration to sleep in milliseconds.
 * @returns A Promise that resolves after the specified duration.
 */

import { getAccessToken } from '@privy-io/react-auth';
import { toast } from 'sonner';

/* eslint-disable  -- needed */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Switches the Ethereum chain using the Ethereum provider.
 * @param chainId - The chain ID to switch to.
 * @returns A Promise representing the switch operation.
 */
export const switchChain = async (chainId: number): Promise<void> => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  });
};

/**
 * Copies the specified text to the clipboard.
 * @param text - The text to copy.
 */
export function copyText(text: string): void {
  const copied = document.createElement('input');
  copied.setAttribute('value', text);
  document.body.appendChild(copied);
  copied.select();
  document.execCommand('copy');
  document.body.removeChild(copied);
}

/**
 * Filters duplicate nodes in the array based on the address property.
 * @param arr - The array to filter.
 * @returns The filtered array without duplicate nodes.
 */
export const filterDuplicateNodes = <T extends { address: string }>(arr: T[]): T[] => {
  return arr.filter((v, i, a) => a.findIndex((v2) => v2.address === v.address) === i);
};

/**
 * Shortens the specified address by truncating the start and end.
 * @param address - The address to shorten.
 * @param length - The length of characters to keep from the start and end. Default is 3.
 * @returns The shortened address.
 */
export const shortenAddr = (address: string, length = 3): string => {
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

// Function to get the access token or show an error toast
export const getAccessTokenWithFallback = async (): Promise<string | null> => {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      toast.error('You are logged out'); // Show an error toast if no access token
    }
    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};
