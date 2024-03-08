import type { CreatePortalDto } from '@/lib/api';
import { backendApi } from '@/lib/backend';

export const usePortal = () => {
  const createPortal = async (portalDto: CreatePortalDto) => {
    const portal = await (await backendApi()).portals.portalsCreate(portalDto);
    return portal.data;
  };

  const addUpdatesToPortal = async ({
    portalId,
    update,
  }: {
    portalId: string;
    update: string;
  }) => {
    const portal = await (await backendApi()).portals.addUpdateUpdate(portalId, update);
    return portal.data;
  };

  const getComments = async (portalId: string) => {
    const comments = await (await backendApi()).portals.commentDetail(portalId);
    return comments;
  };

  const createComment = async (portalId: string, comment: string) => {
    const comments = await (
      await backendApi()
    ).portals.commentCreate(portalId, { comment });
    return comments;
  };

  const replytoComment = async (commentId: string, comment: string) => {
    const comments = await (
      await backendApi()
    ).portals.commentReplyCreate(commentId, { comment });
    return comments;
  };

  const likeComment = async (commentId: string) => {
    const comments = await (await backendApi()).portals.commentLikeCreate(commentId);
    return comments;
  };

  const dislikeComment = async (commentId: string) => {
    const comments = await (await backendApi()).portals.commentDislikeCreate(commentId);
    return comments;
  };

  const deleteComment = async (commentId: string) => {
    const comments = await (await backendApi()).portals.commentDeleteDelete(commentId);
    return comments;
  };

  return {
    createPortal,
    addUpdatesToPortal,
    getComments,
    replytoComment,
    likeComment,
    dislikeComment,
    createComment,
    deleteComment,
  };
};
