import { Suspense } from 'react';
import PrizeLoading from '../../[slug]/loading';
import FetchHistDetails from './fetch-histdetails';

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
