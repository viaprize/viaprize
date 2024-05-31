import type { CreatePrizeDto } from '@/lib/api';
import { backendApi } from '@/lib/backend';

export const usePrize = () => {
  const createPrize = async (prizeDto: CreatePrizeDto) => {
    console.log(prizeDto, 'prizeDto');
    const prize = await (await backendApi()).prizes.prizesCreate(prizeDto);
    return prize.data;
  };

  const participateInPrize = async (prizeId: string) => {
    const prize = await (await backendApi()).prizes.participateCreate(prizeId);
    return prize.data;
  };

  const getParticipants = async (prizeId: string) => {
    const participants = await (await backendApi()).prizes.participantsDetail(prizeId);
    return participants.data;
  };

  return { createPrize, participateInPrize, getParticipants };
};
