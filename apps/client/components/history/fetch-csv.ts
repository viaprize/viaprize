'use server';

import csvParser from 'csv-parser';
import { Readable } from 'node:stream';

interface CSVData {
  Id: number;
  SimpleDescription: string;
  Image: string;
  CardImage: string;
  PrizeName: string;
  WonRefunded: string; // Assuming this is a string, adjust according to actual data
  AwardedUSDe: string;
  WinnersAmount: string;
  Transactionlinks: string;
  Awarded: string;
  RefundedUSDe: string;
  RefundedActual: string;
  Donations: string;
  FundedbyviaPrizeUSDe: string;
  FundedbyviaPrizeActual: string;
  DatePosted: string; // Assuming date is in string format, adjust if different
  Deadline: string;
  PrizeLink: string;
  Category: string;
  WinnersCountry: string;
  PursuersSocials: string;
  WorkLink: string;
  HypercertDraft: string;
  Hypercertlink: string;
  Hypercertmint: string;
  Hypercertclaim: string;
  HypercertOpenSea: string;
  Hypercerttransfer: string;
  Ownership: string;
  LinkedinPost: string;
  TwitterPost: string;
  LinkedInPost: string;
  InstaPost: string;
  Fbpost: string;
  OptionalNotes: string;
}

export async function FetchPrizesCsv() {
  const csvUrl =
    'https://uofqdqrrquswprylyzby.supabase.co/storage/v1/object/public/old_viaprize_data/oldprizefinal107.csv?t=2024-04-08T08%3A26%3A20.784Z';
  const data: CSVData[] = [];

  const response = await fetch(csvUrl);

  const text = await response.text();
  const readableStream = Readable.from(text);
  for await (const row of readableStream.pipe(csvParser())) {
    const csvData = row as CSVData;
    data.push(csvData);
  }

  return data;
}
