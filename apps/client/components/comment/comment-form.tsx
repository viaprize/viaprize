/* eslint-disable import/no-cycle -- its needed here */
'use client';

import { Avatar, Button, Group, Textarea } from '@mantine/core';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { usePortal } from '../hooks/usePortal';
import CommentList from './comment-list';

interface CommentFormProps {
  portalId?: string;
  isReply: boolean;
  commentId?: string;
}

export default function CommentForm({ portalId, commentId,isReply }: CommentFormProps) {
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);

  const { createComment } = usePortal();

  const { mutateAsync: createPortalComment } = useMutation(
    async ({ portalIdfn, comment }: { portalIdfn: string; comment: string }) => {
      const response = await createComment(portalIdfn, comment);
      return response;
    },
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!portalId){
      // here we reply to a comment
      return;
    }
    await createPortalComment({ portalIdfn: portalId, comment: message });
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
