/* eslint-disable import/no-cycle -- its needed here */
'use client';

import { Avatar, Button, Group, Textarea } from '@mantine/core';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { usePortal } from '../hooks/usePortal';
import CommentList from './comment-list';

export default function CommentForm({ portalId }: { portalId: string }) {
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);

  const { createComment } = usePortal();

  // const {mutateAsync:createPortalComment} = useMutation();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // const newComment = {
    //   id: Date.now().toString(),
    //   message,
    //   user: 'Test User',
    //   createdAt: new Date().toISOString(),
    //   likeCount: 0,
    //   likedByMe: false,
    //   dislikeCount: 0,
    //   dislikeByMe: false,
    //   children: [],
    // };
    // setComments([...comments, newComment]);
    // setMessage('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <Avatar color="pink" radius="xl">
          AT
        </Avatar>
        <Textarea
          required
          size="xs"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="w-3/4 "
          placeholder="Join the discussion ...."
        />
        <Button size="sm" type="submit">
          Post
        </Button>
      </Group>

      {/* Note:The comment list commponent used here is just for testing purpose */}
      <CommentList comments={comments} />
      {/* Note:The comment list commponent used here is just for testing purpose */}
    </form>
  );
}
