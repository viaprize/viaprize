/* eslint-disable import/no-cycle  -- we are using comments*/
'use client';

import type { PortalsComments } from '@/lib/api';
import Comment from './comment';

export default function CommentList({
  portalComments,
}: {
  portalComments: PortalsComments[];
}) {
  return (
    <>
      {portalComments.map((c) => (
        <div key={c.id} className="my-2 mx-0">
          <Comment portalComment={c} />
        </div>
      ))}
    </>
  );
}
