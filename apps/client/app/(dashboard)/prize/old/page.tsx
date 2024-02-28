import HistoryCard from '@/components/history/history-card';
import fs from 'node:fs';
import { parse } from 'papaparse';
import prize from './prizes.csv';


const parseCsvData = () => {
  const csvData = fs.readFileSync(prize, 'utf8');
  const results = parse(csvData, { header: true });

  return results;
};

export default function HistoryPage() {
  console.log(parseCsvData(), 'fetchData');

  return (
    <div className="grid grid-cols-3 space-x-2 ">
      <HistoryCard
        status="Won"
        datePosted="19 JAN 2024"
        title="Write out a non-KYC way to vote on bounty winners"
        description="Umar Khan & Colton Orr $1000, Philippe Dumonet & Kyle Weiss $200, Gordon Berger $100"
        awarded="$500"
      />
    </div>
  );
}
