import type { CreatePrizeDto } from '@/lib/api';
import { backendApi } from '@/lib/backend';

export const usePrize = () => {
  const createPrize = async (prizeDto: CreatePrizeDto) => {
    console.log(prizeDto, 'prizeDto');
    const prize = await (await backendApi()).prizes.prizesCreate(prizeDto);
    return prize.data;
  };

  const contestantInPrize = async (prizeId: string) => {
    const prize = await (await backendApi()).prizes.participateCreate(prizeId);
    return prize.data;
  };

  const getContestants = async (prizeId: string) => {
    const contestants = await(await backendApi()).prizes.contestantsDetail(prizeId);
    return contestants.data;
  };

  return { createPrize, contestantInPrize, getContestants };
};
