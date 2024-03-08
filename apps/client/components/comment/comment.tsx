'use client';

/* eslint-disable import/no-cycle -- use for multiple comments */
import type { PortalsComments } from '@/lib/api';
import { ActionIcon, Avatar, Button, Flex, Group, Paper, Text } from '@mantine/core';
import {
  IconArrowBackUp,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
} from '@tabler/icons-react';
import { Suspense, useState } from 'react';
import useAppUser from '../hooks/useAppUser';
import CommentForm from './comment-form';
import FetchChildComment from './fetch-child-comments';

export default function Comment({ portalComment }: { portalComment: PortalsComments }) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(true);
  console.log(portalComment, 'portalComment');

  const { appUser } = useAppUser();

  const isLikedByMe = portalComment.likes.includes(appUser?.authId ?? '');
  const isDislikedByMe = portalComment.dislikes.includes(appUser?.authId ?? '');

  /// #if DEBUG
  const [likeCount, setLikeCount] = useState(portalComment.likes.length);
  const [dislikeCount, setDislikeCount] = useState(portalComment.dislikes.length);
  const [likedByMe, setLikedByMe] = useState(isLikedByMe);
  const [dislikedByMe, setDislikedByMe] = useState(isDislikedByMe);
  const [isReplying, setIsReplying] = useState(false);

  const handleLike = () => {
    console.log('handleLike');
  };

  const handleDislike = () => {
    console.log('handleDislike');
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
          <ActionIcon variant="transparent" size="md" color="red">
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
