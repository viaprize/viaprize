import React, { Suspense } from 'react';
import FetchHistDetails from './fetch-histdetails';
import PrizeLoading from '../../[id]/loading';

export default function OldPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex justify-center w-full">
      <Suspense fallback={<PrizeLoading />}>
        {/* @ts-expect-error Server Component */}
        <FetchHistDetails params={params} />
      </Suspense>
    </div>
  );
}
