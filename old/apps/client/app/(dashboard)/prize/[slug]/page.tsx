import { Suspense } from 'react';
import FetchPrize from './fetch-prize';
import PrizeLoading from './loading';

export default function PrizePage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex justify-center w-full">
      <Suspense fallback={<PrizeLoading />}>
        {/* @ts-expect-error Server Component */}
        <FetchPrize params={params} />
      </Suspense>
    </div>
  );
}
