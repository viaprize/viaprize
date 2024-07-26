/**
 * Sleeps for the specified duration.
 * @param ms - The duration to sleep in milliseconds.
 * @returns A Promise that resolves after the specified duration.
 */

import { env } from '@env';
import { TToken } from '@gitcoin/gitcoin-chain-data';
import { getAccessToken } from '@privy-io/react-auth';
import { createClient } from '@supabase/supabase-js';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { Parser } from 'htmlparser2';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import {
  encodeAbiParameters,
  encodePacked,
  getAddress,
  Hex,
  keccak256,
  parseAbiParameters,
  parseUnits,
} from 'viem';
import { USDC } from './constants';

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export function formatDateString(date: Date): string {
  // Parse the date string to a Date object
  // Format the Date object to the desired format
  const formattedDate = format(date, 'd MMMM yyyy');

  return formattedDate;
}

export const calculateDeadline = (createdDate: Date, endDate: Date) => {
  const remainingTime = endDate.getTime() - createdDate.getTime();
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

export const calculateDeadlineDate = (
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
  const format = new Intl.DateTimeFormat('en', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return format.format(new Date(date));
};

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

const cleanImageName = (name: string) => {
  return name.replace(/[^a-zA-Z0-9]/g, '');
};
export const storeFiles = async (files: File[]) => {
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_API_KEY,
  );
  const { data, error } = await supabase.storage
    .from('campaigns')
    .upload(
      `${generateRandomThreeDigitNumber()}${cleanImageName(files[0].name)}`,
      files[0],
    )
    .catch((error) => {
      console.error('Error uploading file:', error);
      throw error;
    });
  console.log(data, 'data');

  if (!files[0] || error) {
    return '';
  }
  console.log(data.path, 'image path');
  return `https://uofqdqrrquswprylyzby.supabase.co/storage/v1/object/public/campaigns/${data.path}`;
};
export const parseUsdc = (value: bigint) => parseFloat(value.toString()) / 10 ** 6;
export const formatUsdc = (value: number) => BigInt(value * 10 ** 6);
export const usdcSignType = ({
  owner,
  spender,
  value,
  nonce,
  deadline,
}: {
  owner: string;
  spender: string;
  value: BigInt;
  nonce: BigInt;
  deadline: BigInt;
}) => {
  return {
    message: {
      owner,
      spender,
      value,
      nonce,
      deadline,
    },
    types: {
      Permit: [
        {
          name: 'owner',
          type: 'address',
        },
        {
          name: 'spender',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
        {
          name: 'nonce',
          type: 'uint256',
        },
        {
          name: 'deadline',
          type: 'uint256',
        },
      ],
    },
    primaryType: 'Permit',
    domain: {
      chainId: 8453,
      verifyingContract: USDC,
      name: 'USD Coin',
      version: '2',
    },
  };
};

export function voteMessageHash(
  submission: string,
  amount: number,
  nonce: number,
  contractAddress: string,
): string {
  const encodedMessage = encodePacked(
    ['string', 'bytes32', 'string', 'uint256', 'string', 'uint256', 'string', 'address'],
    [
      'VOTE FOR ',
      submission as `0x${string}`,
      ' WITH AMOUNT ',
      BigInt(amount),
      ' AND NONCE ',
      BigInt(nonce),
      ' WITH PRIZE CONTRACT ',
      contractAddress as `0x${string}`,
    ],
  );
  const messageHash = keccak256(encodedMessage);
  return messageHash;
}

export const refundHash = () => keccak256(encodePacked(['string'], ['REFUND']));

export const addDaysToDate = (date: Date, days: number) => {
  const newDate = date.setDate(date.getDate() + days);
  return new Date(newDate);
};

export const addMinutesToDate = (date: Date, minutes: number) => {
  const newDate = date.setMinutes(date.getMinutes() + minutes);
  return new Date(newDate);
};

export function encodedQFAllocation(
  donationToken: TToken,
  donations: { anchorAddress: string; amount: string }[],
): Hex[] {
  const tokenAddress = donationToken.address;

  const encodedData = donations.map((donation) => {
    if (!donation.anchorAddress) {
      throw new Error('Anchor address is required for QF allocation');
    }
    return encodeAbiParameters(
      parseAbiParameters('address,uint8,(((address,uint256),uint256,uint256),bytes)'),
      [
        getAddress(donation.anchorAddress),
        0, // permit type of none on the strategy
        [
          [
            [
              getAddress(tokenAddress),
              parseUnits(donation.amount, donationToken.decimals),
            ],
            BigInt(0), // nonce, since permit type is none
            BigInt(0), // deadline, since permit type is none
          ],
          '0x0000000000000000000000000000000000000000000000000000000000000000', // signature, since permit type is none
        ],
      ],
    );
  });

  return encodedData;
}
