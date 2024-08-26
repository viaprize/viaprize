import { Api } from '@/lib/api';
// eslint-disable-next-line import/no-cycle
import CommentList from './comment-list';

export default async function FetchChildComment({
  parentCommentId,
}: {
  parentCommentId: string;
}) {
  const childComments = (await new Api().portals.commentRepliesDetail(parentCommentId))
    .data;

  return <CommentList portalComments={childComments} />;
}
