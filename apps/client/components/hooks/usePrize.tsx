import type { CreatePrizeDto } from '@/lib/api';
import { backendApi } from '@/lib/backend';

export const usePrize = () => {
  const createPrize = async (prizeDto: CreatePrizeDto) => {
    console.log(prizeDto, 'prizeDto');
    const prize = await (await backendApi()).prizes.prizesCreate(prizeDto);
    return prize.data;
  };

  return { createPrize };
};
