'use client';

/* eslint-disable import/no-cycle -- use for multiple comments */
import type { PortalsComments } from '@/lib/api';
import { ActionIcon, Avatar, Button, Flex, Group, Paper, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconArrowBackUp,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
} from '@tabler/icons-react';
import { Suspense, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import useAppUser from '../hooks/useAppUser';
import { usePortal } from '../hooks/usePortal';
import CommentForm from './comment-form';
import FetchChildComment from './fetch-child-comments';

export default function Comment({ portalComment }: { portalComment: PortalsComments }) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(true);
  console.log(portalComment, 'portalComment');

  const { appUser } = useAppUser();
  const { likeComment, dislikeComment, deleteComment } = usePortal();
  const { mutateAsync: likeCommentfn } = useMutation(likeComment);
  const { mutateAsync: dislikeCommentfn } = useMutation(dislikeComment);
  const { mutateAsync: deleteCommentfn } = useMutation(deleteComment);

  const isLikedByMe = portalComment.likes.includes(appUser?.authId ?? '');
  console.log(
    appUser?.authId,
    'authId',
    portalComment.likes,
    'likes',
    isLikedByMe,
    'isLikedByMe',
  );
  const isDislikedByMe = portalComment.dislikes.includes(appUser?.authId ?? '');

  const openDeleteModal = () => {
    modals.openConfirmModal({
      title: 'Delete your Comment ?',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete your comment? This action is destructive and you
          will have to contact support to restore your data.
        </Text>
      ),
      labels: { confirm: 'Delete Comment', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => {
        console.log('Cancel');
      },
      onConfirm: () => {
        toast.promise(deleteCommentfn(portalComment.id), {
          loading: 'Deleting comment',
          success: 'Comment deleted',
          error: 'Error deleting comment',
        });
      },
    });
  };

  /// #if DEBUG
  const [likeCount, setLikeCount] = useState(portalComment.likes.length);
  const [dislikeCount, setDislikeCount] = useState(portalComment.dislikes.length);
  const [likedByMe, setLikedByMe] = useState(isLikedByMe);
  const [dislikedByMe, setDislikedByMe] = useState(isDislikedByMe);
  const [isReplying, setIsReplying] = useState(false);

  const handleLikeState = () => {
    if (likedByMe) {
      setLikeCount((prev) => prev - 1);
      setLikedByMe(false);
    }
    if (dislikedByMe) {
      setDislikeCount((prev) => prev - 1);
      setDislikedByMe(false);
      setLikeCount((prev) => prev + 1);
      setLikedByMe(true);
    } else {
      setLikeCount((prev) => prev + 1);
      setLikedByMe(true);
    }
  };

  const handleLike = async () => {
    handleLikeState();
    await likeCommentfn(portalComment.id).catch(() => {
      handleLikeState();
      toast.error('Error liking comment');
    });
  };

  const handleDislikeState = () => {
    if (dislikedByMe) {
      setDislikeCount((prev) => prev - 1);
      setDislikedByMe(false);
    }
    if (likedByMe) {
      setLikeCount((prev) => prev - 1);
      setLikedByMe(false);
      setDislikeCount((prev) => prev + 1);
      setDislikedByMe(true);
    } else {
      setDislikeCount((prev) => prev + 1);
      setDislikedByMe(true);
    }
  };

  const handleDislike = async () => {
    handleDislikeState();
    await dislikeCommentfn(portalComment.id).catch(() => {
      handleDislikeState();
      toast.error('Error disliking comment');
    });
  };
  ///

  return (
    <>
      <Paper shadow="xs" radius="lg" withBorder p="sm">
        <Group justify="space-between">
          <Group>
            <Avatar radius="xl" src={portalComment.user.avatar}>
              {portalComment.user.name[0]}
            </Avatar>
            <Text size="md" fw={600}>
              {portalComment.user.name}
            </Text>
          </Group>
          <Text size="sm">
            created at {new Date(portalComment.created_at).toLocaleTimeString()}
          </Text>
        </Group>

        <Text size="sm" m="sm">
          {portalComment.comment}
        </Text>
        <Flex gap="md" justify="flex-start" align="center" direction="row">
          <ActionIcon
            color={likedByMe ? 'blue' : 'gray'}
            variant="transparent"
            size="lg"
            onClick={handleLike}
          >
            <IconThumbUp /> <Text size="sm">{likeCount}</Text>
          </ActionIcon>
          <ActionIcon
            color={dislikedByMe ? 'blue' : 'gray'}
            variant="transparent"
            size="lg"
            onClick={handleDislike}
          >
            <IconThumbDown /> <Text size="sm">{dislikeCount}</Text>
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="blue"
            size="md"
            onClick={() => {
              setIsReplying(true);
            }}
          >
            <IconArrowBackUp />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            size="md"
            color="red"
            onClick={openDeleteModal}
          >
            <IconTrash />
          </ActionIcon>
        </Flex>
      </Paper>

      {isReplying ? (
        <div className="relative mt-1 ml-3">
          <CommentForm commentId={portalComment.id} isReply />
          <Button
            className="absolute right-0 top-2"
            onClick={() => {
              setIsReplying(false);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : null}

      {portalComment.reply_count > 0 ? (
        <>
          {!areChildrenHidden ? (
            <div className={`flex `}>
              <button
                className="border-none bg-none p-0 w-2 mt-2 relative cursor-pointer outline-none transform -translate-x-1/2"
                aria-label="Hide Replies"
                onClick={() => {
                  setAreChildrenHidden(true);
                }}
              />
              <div className="pl-4 flex-grow">
                <Suspense fallback={<div>Loading...</div>}>
                  {/* @ts-expect-error Server Component */}
                  <FetchChildComment parentCommentId={portalComment.id} />
                </Suspense>
                {/* <CommentList portalComments={portalComment.childComments} /> */}
              </div>
            </div>
          ) : (
            <Text
              c="blue"
              size="sm"
              fw={700}
              className={`underline cursor-pointer mt-1 `}
              onClick={() => {
                setAreChildrenHidden(false);
              }}
            >
              {portalComment.reply_count} replies
            </Text>
          )}
        </>
      ) : null}
    </>
  );
}
