// @ts-nocheck

/**
 * useContract hook.
 * This hook creates a new contract instance using the provided ABI and address.
 *
 * @module hooks/useContract
 */

import { useMemo } from 'react';
import useWeb3Context from './useWeb3Context';
import { AbiItem } from 'web3-utils';
/**
 * @function useContract
 * @description Creates a new contract instance using the provided ABI and address.
 * @param {Array} ABI - The ABI (Application Binary Interface) of the contract.
 * @param {string} address - The address of the contract.
 * @returns {Object} A contract instance.
 */
export default function useContract(ABI: AbiItem | AbiItem[], address: string) {
  const { web3 } = useWeb3Context();

  return useMemo(() => {
    // If there is no web3 instance, return undefined.
    if (!web3) {
      return;
    }

    // Create a new contract instance with the provided ABI and address.
    return new web3.eth.Contract(ABI, address);
  }, [web3]); // Only recompute the memoized value when the web3 instance changes.
}
