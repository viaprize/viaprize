/**
 * Sleeps for the specified duration.
 * @param ms - The duration to sleep in milliseconds.
 * @returns A Promise that resolves after the specified duration.
 */

import { env } from '@env';
import { getAccessToken } from '@privy-io/react-auth';
import { createClient } from '@supabase/supabase-js';
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

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function unslugify(str: string) {
  return str.replace(/-/g, ' ');
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

export function toSentenceCase(str: string) {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function isArrayOfFile(files: unknown): files is File[] {
  const isArray = Array.isArray(files);
  if (!isArray) return false;
  return files.every((file) => file instanceof File);
}

function generateRandomThreeDigitNumber() {
  // Option 1: Using Math.floor and modulo
  const randomNum = Math.floor(Math.random() * 900) + 100; // Generates a number between 100 and 999

  // Option 2: Using string manipulation
  // let randomNum = (Math.random() * 1000).toString().padStart(3, "0");
  // randomNum = parseInt(randomNum);

  return randomNum;
}
export const storeFiles = async (files: File[]) => {
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_API_KEY,
  );
  const { data, error } = await supabase.storage
    .from('campaigns')
    .upload(`${generateRandomThreeDigitNumber()}${files[0].name}`, files[0]);
  console.log(data, 'data');

  if (!files[0] || error) {
    return '';
  }
  console.log(data.path, 'image path');
  return `https://uofqdqrrquswprylyzby.supabase.co/storage/v1/object/public/campaigns/${data.path}`;
};
