import { useContractWrite, useContractReads } from 'wagmi';
import { getContract } from '@wagmi/core';
import viaPrize from './abi/viaPrize.json';
import { AbiItem } from 'viem';

export const usePrize = () => {
  const contract = getContract({
    address: '0x123',
    abi: viaPrize,
  });

  const {
    data: addFundsData,
    isLoading: addFundsIsLoading,
    isSuccess: addFundsIsSuccess,
    write: addFundsWrite,
  } = useContractWrite({
    address: contract.address,
    abi: contract.abi,
    functionName: 'addFunds',
  });

  const {
    data: votingPeriodData,
    isLoading: votingPeriodIsLoading,
    isSuccess: votingPeriodIsSuccess,
    write: votingPeriodWrite,
  } = useContractWrite({
    address: contract.address,
    abi: contract.abi,
    functionName: 'start_voting_period',
  });

  const {
    data: submissionPeriodData,
    isLoading: submissionPeriodIsLoading,
    isSuccess: submissionPeriodIsSuccess,
    write: submissionPeriodWrite,
  } = useContractWrite({
    address: contract.address,
    abi: contract.abi,
    functionName: 'start_submission_period',
  });

  const {
    data: addSubmissionData,
    isLoading: addSubmissionIsLoading,
    isSuccess: addSubmissionIsSuccess,
    write: addSubmissionWrite,
  } = useContractWrite({
    address: contract.address,
    abi: contract.abi,
    functionName: 'addSubmission',
  });

  const {
    data: readData,
    isError: readIsError,
    isLoading: readIsLoading,
  } = useContractReads({
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
    ],
  });
};
