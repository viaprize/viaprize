'use client';

import { renderToHTML } from '@/lib/utils';

export default function DescriptionHtml({ description }: { description: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: renderToHTML(description),
      }}
    />
  );
}
