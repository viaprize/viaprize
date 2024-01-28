import { usePrizeJudgesJudgeFunds, usePrizePatronAmount } from '@/lib/smartContract';

export const useFunderBalance = ({
  hasJudges,
  contractAddress,
  address,
}: {
  hasJudges: boolean;
  contractAddress: string;
  address: string;
}) => {
  const {
    data: funderBalance,
    refetch: refetchBalance,
    isLoading: isLoadingBalance,
  } = usePrizePatronAmount({
    address: contractAddress as `0x${string}`,
    args: [(address as `0x${string}`) ?? '0x'],
  });

  const {
    data: judgeBalance,
    refetch: refetchJudgeBalance,
    isLoading: isLoadingJudgeBalance,
  } = usePrizeJudgesJudgeFunds({
    address: contractAddress as `0x${string}`,
    args: [(address as `0x${string}`) ?? '0x'],
  });

  return {
    data: hasJudges ? judgeBalance : funderBalance,
    refetch: async () => {
      if (hasJudges) {
        await refetchJudgeBalance();
      } else {
        await refetchBalance();
      }
    },
    loading: isLoadingJudgeBalance || isLoadingBalance,
  };
};
