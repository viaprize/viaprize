/* eslint-disable import/no-cycle */
import { ActionIcon, Avatar, Button, Flex, Group, Paper, Text } from '@mantine/core';
import {
  IconArrowBackUp,
  IconEdit,
  IconThumbDown,
  IconThumbUp,
  IconTrash,
} from '@tabler/icons-react';
import { useState } from 'react';
import CommentForm from './comment-form';
import CommentList from './comment-list';

interface CommentProps {
  comment: {
    id: string;
    message: string;
    user: string;
    createdAt: string;
    likeCount: number;
    likedByMe: boolean;
    dislikeCount: number;
    dislikeByMe: boolean;
    children?: {
      id: string;
      message: string;
      user: string;
      createdAt: string;
      likeCount: number;
      likedByMe: boolean;
      dislikeCount: number;
      dislikeByMe: boolean;
      children?: any[];
    }[];
  };
}

export default function Comment({ comment }: CommentProps) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(true);

  /// #if DEBUG
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [dislikeCount, setDislikeCount] = useState(comment.dislikeCount);
  const [likedByMe, setLikedByMe] = useState(comment.likedByMe);
  const [dislikedByMe, setDislikedByMe] = useState(comment.dislikeByMe);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleLike = () => {
    if (!likedByMe && !dislikedByMe) {
      setLikeCount(likeCount + 1);
      setLikedByMe(true);
    } else if (!likedByMe && dislikedByMe) {
      setLikeCount(likeCount + 1);
      setDislikeCount(dislikeCount - 1);
      setLikedByMe(true);
      setDislikedByMe(false);
    }
  };

  const handleDislike = () => {
    if (!likedByMe && !dislikedByMe) {
      setDislikeCount(dislikeCount + 1);
      setDislikedByMe(true);
    } else if (likedByMe && !dislikedByMe) {
      setLikeCount(likeCount - 1);
      setDislikeCount(dislikeCount + 1);
      setLikedByMe(false);
      setDislikedByMe(true);
    }
  };
  ///

  return (
    <>
      <Paper shadow="xs" radius="lg" withBorder p="sm">
        <Group justify="space-between">
          <Group>
            <Avatar radius="xl" />
            <Text size="md" fw={600}>
              {comment.user}
            </Text>
          </Group>
          <Text size="sm">{comment.createdAt}</Text>
        </Group>

        {isEditing ? (
          <div className="relative">
            <CommentForm />
            <Button className="absolute right-0 top-2" onClick={() => setIsEditing(0)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Text size="sm" m="sm">
            {comment.message}
          </Text>
        )}
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
            onClick={() => setIsReplying(true)}
          >
            <IconArrowBackUp />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="blue"
            size="md"
            onClick={() => setIsEditing(true)}
          >
            <IconEdit />
          </ActionIcon>
          <ActionIcon variant="transparent" size="md" color="red">
            <IconTrash />
          </ActionIcon>
        </Flex>
      </Paper>

      {isReplying ? (
        <div className="relative mt-1 ml-3">
          <CommentForm />
          <Button className="absolute right-0 top-2" onClick={() => setIsReplying(false)}>
            Cancel
          </Button>
        </div>
      ) : null}

      {comment.children && comment.children.length > 0 ? (
        <>
          <div className={`flex ${areChildrenHidden ? 'hidden' : ''}`}>
            <button
              className="border-none bg-none p-0 w-2 mt-2 relative cursor-pointer outline-none transform -translate-x-1/2"
              aria-label="Hide Replies"
              onClick={() => {
                setAreChildrenHidden(true);
              }}
            />
            <div className="pl-4 flex-grow">
              <CommentList comments={comment.children} />
            </div>
          </div>
          <Text
            c="blue"
            size="sm"
            fw={700}
            className={`underline cursor-pointer mt-1 ${!areChildrenHidden ? 'hidden' : ''}`}
            onClick={() => {
              setAreChildrenHidden(false);
            }}
          >
            {comment.children && comment.children.length > 0
              ? comment.children.length
              : 0}{' '}
            replies
          </Text>
        </>
      ) : null}
    </>
  );
}
