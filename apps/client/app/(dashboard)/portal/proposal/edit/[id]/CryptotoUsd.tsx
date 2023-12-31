/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
'use server';

type ConvertUSD = Record<
  string,
  {
    usd: number;
  }
>;

export default async function getCryptoToUsd(): Promise<ConvertUSD> {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`,
  );
  const final = await response.json();
  return Object.keys(final).length === 0
    ? {
        ethereum: {
          usd: 2357.89,
        },
      }
    : final;
}
