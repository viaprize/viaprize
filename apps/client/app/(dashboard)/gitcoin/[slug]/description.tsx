'use client';

import { renderToHTML } from 'app/(dashboard)/(_utils)/utils';

export default function Description({ description }: { description: string }) {
  return (
    <div className="overflow-hidden gitcoindescriptionparent">
      <div
        dangerouslySetInnerHTML={{
          __html: renderToHTML(description),
        }}
      />
    </div>
  );
}
