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
  console.log(`here is voting time: ${votingTime}`)
}

export const endSubmissionPeriod = async() => {
  await contract.end_submission_period();
  console.log("Great, Submission Period has ended...");
}

export const startVotingPeriod = async(votingTime: number) => {
  try {
    const transaction = await contract.start_voting_period(votingTime);
    transaction.wait();
    console.log("voting period has started successfully...")
  } catch (error) {
    console.log(`Error while setting Voting Period ${error}`)
  }
}

export const addSubmission = async(submitter: string, submissionText: string, threshold: number) => {
  try {
     const submitProposal = await contract.addSubmission(submitter, submissionText, threshold);
     submitProposal.await();
     console.log("Congrats, you have successfully submitted Proposal...")
  } catch (error) {
    console.log(`you got this error ${error} while submitting proposal...`)
  }
}
