import { env } from '@env';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client

// Upload file using standard upload

/**
 * Sleep for a given number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified time.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Switches the Ethereum chain using the wallet provider.
 * @param chainId - The ID of the chain to switch to.
 */
export const switchChain = async (chainId: number): Promise<void> => {
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  });
};

/**
 * Shortens an address by displaying only a portion of it.
 * @param address - The address to shorten.
 * @param unit - The number of characters to display at the beginning and end of the address.
 * @returns The shortened address.
 */
export const shortenAddress = (address: string, unit?: number): string => {
  const unitLength = unit || 3;
  return `${address.slice(0, unitLength)}...${address.slice(-unitLength)}`;
};

/**
 * Copies the given text to the clipboard.
 * @param text - The text to copy.
 */
export function copyToClipboard(text: string): void {
  const copied = document.createElement('input');
  copied.setAttribute('value', text);
  document.body.appendChild(copied);
  copied.select();
  document.execCommand('copy');
  document.body.removeChild(copied);
}

/**
 * Formats an IPFS URL by replacing "ipfs://" with "https://ipfs.io/ipfs/".
 * @param url - The IPFS URL to format.
 * @returns The formatted URL.
 */
export const formatIPFS = (url: string): string => {
  return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
};

function generateRandomThreeDigitNumber() {
  // Option 1: Using Math.floor and modulo
  let randomNum = Math.floor(Math.random() * 900) + 100; // Generates a number between 100 and 999

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

  if (!files[0] || error) {
    return '';
  }
  console.log(data.path, 'path');
  return `https://uofqdqrrquswprylyzby.supabase.co/storage/v1/object/public/campaigns/${data.path}`;
};
