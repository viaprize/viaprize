'use client';

import { Avatar, Button, Group, Textarea } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import useAppUser from '../hooks/useAppUser';
import { usePortal } from '../hooks/usePortal';

interface CommentFormProps {
  portalId?: string;
  isReply: boolean;
  commentId?: string;
}

export default function CommentForm({ portalId, commentId, isReply }: CommentFormProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { createComment, replytoComment } = usePortal();

  const { mutateAsync: createPortalComment } = useMutation(
    async ({ portalIdfn, comment }: { portalIdfn: string; comment: string }) => {
      const response = await createComment(portalIdfn, comment);
      return response;
    },
  );

  const { mutateAsync: replyToPortalComment } = useMutation(
    async ({ fncommentId, comment }: { fncommentId: string; comment: string }) => {
      const response = await replytoComment(fncommentId, comment);
      return response;
    },
  );

  const { appUser } = useAppUser();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!portalId && !commentId) {
      toast.error('Portal id or comment id is missing');
      // here we reply to a comment
      return;
    }
    if (isReply) {
      if (!commentId) {
        toast.error('Comment id is missing');
        return;
      }
      setLoading(true);
      await replyToPortalComment({ fncommentId: commentId, comment: message }).then(
        () => {
          router.refresh();
          setLoading(false);
          setMessage('');
        },
      );
      setLoading(false);
      return;
    }
    setLoading(true);
    if (!portalId) {
      return;
    }
    await createPortalComment({ portalIdfn: portalId, comment: message }).then(() => {
      router.refresh();
      setLoading(false);
      setMessage('');
    });
    setLoading(false);
    // setComments([...comments, newComment]);
    // setMessage('');
  }

  if (!appUser) {
    return <div>Sign in to comment</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <Avatar color="pink" radius="xl" src={appUser.avatar}>
          {appUser.name[0]}
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
        <Button size="sm" type="submit" loading={loading}>
          Post
        </Button>
      </Group>

      {/* Note:The comment list commponent used here is just for testing purpose */}
      {/* <CommentList comments={comments} /> */}
      {/* Note:The comment list commponent used here is just for testing purpose */}
    </form>
  );
}
