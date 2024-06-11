import { Api } from '@/lib/api';
import { Divider } from '@mantine/core';
import CommentForm from './comment-form';
import CommentList from './comment-list';

export default async function CommentSection({ portalId }: { portalId: string }) {
  const portalComments = (
    await new Api().portals.commentDetail(portalId, {
      next: {
       tags: ['portalComments'],
      },
    })
  ).data;
  console.log(portalComments, 'portal');

  return (
    <>
      <h2>Comments ({portalComments.length})</h2>
      <Divider my="md" />
      <section>
        <CommentForm portalId={portalId} isReply={false} />
        {portalComments.length > 0 && (
          <div className="mt-4">
            <CommentList portalComments={portalComments} />
          </div>
        )}
      </section>
    </>
  );
}
