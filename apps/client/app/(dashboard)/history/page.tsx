import HistoryCard from '@/components/history/history-card'
import React from 'react'

export default function HistoryPage() {
  return (
    <div className="grid grid-cols-3 space-x-2 ">
      <HistoryCard
        status={'Won'}
        datePosted={'19 JAN 2024'}
        title={'Write out a non-KYC way to vote on bounty winners'}
        description={
          'Umar Khan & Colton Orr $1000, Philippe Dumonet & Kyle Weiss $200, Gordon Berger $100'
        }
        awarded={'$500'}
      />
   
    </div>
  );
}
