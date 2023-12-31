/**
 * Sleeps for the specified duration.
 * @param ms - The duration to sleep in milliseconds.
 * @returns A Promise that resolves after the specified duration.
 */

import { getAccessToken } from '@privy-io/react-auth';
import { Parser } from 'htmlparser2';
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

export function htmlToPlainText(html: string): string {
  let textContent = '';

  const parser = new Parser(
    {
      ontext: (text) => {
        textContent += text;
      },
    },
    { decodeEntities: true },
  );

  parser.write(html);
  parser.end();

  return textContent;
}

export const calculateRemainingTime = (submissionDate: string) => {
  const remainingTime = new Date(submissionDate).getTime() - Date.now();

  if (remainingTime <= 0) {
    return 'Time is up!';
  } else if (remainingTime < 60 * 60 * 1000) {
    // Less than 1 hour in milliseconds
    const minutes = Math.floor(remainingTime / (60 * 1000));
    return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
  } else if (remainingTime < 24 * 60 * 60 * 1000) {
    // Less than 1 day in milliseconds
    const hours = Math.floor(remainingTime / (60 * 60 * 1000));
    return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
  }
  const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
  return `${days} day${days !== 1 ? 's' : ''} remaining`;
};

export const calculateDeadline = (
  startSubmissionTime: string,
  submissionDays: number,
) => {
  const start = new Date(startSubmissionTime);
  const submissionDate = new Date(startSubmissionTime);
  submissionDate.setDate(start.getDate() + submissionDays);
  const remainingTime = calculateRemainingTime(submissionDate.toISOString());
  const dateString = submissionDate.toISOString().split('T')[0];
  return { remainingTime, dateString };
};

export const formatDate = (date: string): string => {
  const format = new Intl.DateTimeFormat('en-ZA', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return format.format(new Date(date));
};
export const ADMINS = [];
