import { useContractWrite, useContractReads } from 'wagmi';
import { getContract } from '@wagmi/core';
import viaPrize from './abi/viaPrize.json';
import { AbiItem } from 'viem';

export const usePrize = () => {
  const contract = getContract({
    address: '0x123',
    abi: viaPrize,
  });

  const { data: writeData, isLoading: writeIsLoading, isSuccess: writeIsSuccess, write } = useContractWrite({
      address: contract.address,
      abi: contract.abi,
      functionName: 'addFunds',
  });

  const { data: readData, isError: readIsError, isLoading: readIsLoading } = useContractReads({
    contracts: [
      {
        address: contract.address,
        abi: contract.abi as AbiItem[],
        functionName: 'get_submission_time',
      },
      {
        address: contract.address,
        abi: contract.abi as AbiItem[],
        functionName: 'get_voting_time',
      },
    ]
  });
};
