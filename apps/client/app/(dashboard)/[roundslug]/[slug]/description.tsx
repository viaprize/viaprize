'use client';

import dynamic from 'next/dynamic';

const DescriptionHtml = dynamic(() => import('@/components/gitcoin/description-html'), {
  ssr: false,
});

export default function Description({ description }: { description: string }) {
  return (
    <div className="overflow-hidden gitcoindescriptionparent dont-break-out">
      <DescriptionHtml description={description} />
    </div>
  );
}
