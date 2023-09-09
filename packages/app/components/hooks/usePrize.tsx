import { useContractWrite } from 'wagmi';
import { getContract } from '@wagmi/core';
import { Contract } from 'ethers';
import viaPrize from "./abi/viaPrize.json"

export const usePrize = () => {
  const contract = getContract({
    address: '0x123',
    abi:  viaPrize,
  });

  const {
    write: addFunds,
    isLoading: addFundsIsLoading,
    error: addFundsError,
  } = useContractWrite(contract, 'addFunds');
  const {
    write: startSubmissionPeriod,
    isLoading: startSubmissionPeriodIsLoading,
    error: startSubmissionPeriodError,
  } = useContractWrite(contract, 'start_submission_period');
  const {
    write: addSubmission,
    isLoading: addSubmissionIsLoading,
    error: addSubmissionError,
  } = useContractWrite(contract, 'addSubmission');
  const {
    write: startVotingPeriod,
    isLoading: startVotingPeriodIsLoading,
    error: startVotingPeriodError,
  } = useContractWrite(contract, 'start_voting_period');
  const {
    write: endSubmissionPeriod,
    isLoading: endSubmissionPeriodIsLoading,
    error: endSubmissionPeriodError,
  } = useContractWrite(contract, 'end_submission_period');
  const {
    data: votingTime,
    isLoading: votingTimeIsLoading,
    error: votingTimeError,
  } = useContractRead(contract, 'get_voting_time');
  const {
    data: submissionTime,
    isLoading: submissionTimeIsLoading,
    error: submissionTimeError,
  } = useContractRead(contract, 'get_submission_time');
};
