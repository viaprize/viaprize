import {useContract, useSigner} from 'wagmi';
import { ethers } from 'ethers';
const { signer } = useSigner();
const contract = useContract({
  address: '1234',
  abi: 'xyz',
  signerOrProvider: signer,
});

export const addFunds = async (value: ethers.BigNumber) => {
  try {
    const tx = await contract.addFunds({ value });
    await tx.wait();
    console.log('Funds added to the contract.');
  } catch (error) {
    console.error('Error adding funds:', error);
    throw error;
  }
};

export const startSubmissionPeriod = async (submissionTime: number) => {
  try {
    const tx = await contract.start_submission_period(submissionTime);
    await tx.wait();
    console.log('Submission period started.');
  } catch (error) {
    console.error('Error starting submission period:', error);
    throw error;
  }
};

export const getTotalFunds = async () => {
  const totalFunds = await contract.total_funds();
  console.log('Total Funds:', totalFunds);
};

export const getSubmissionPeriod = async() => {
  const submissionTime = await contract.get_submission_time();
  console.log("Here is the Submission Time: ", submissionTime)
}

export const getVotingTime = async() => {
  const votingTime = await contract.get_voting_time();
  console.log("here is voting time: ", votingTime)
}

export const endSubmissionPeriod = async() => {
  await contract.end_submission_period();
  console.log("Great, Submission Period has ended...");
}
