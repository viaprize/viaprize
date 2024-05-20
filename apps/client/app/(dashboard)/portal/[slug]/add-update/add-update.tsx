'use client';

import NotAutherized from '@/components/custom/not-autherized';
import useAppUser from '@/components/hooks/useAppUser';
import { usePortal } from '@/components/hooks/usePortal';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import type { PortalWithBalance } from '@/lib/api';
import { Button, Card } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

const updateWithDate = (update: string) => {
  return `${new Date().toString()}: update:${update}`;
};

const extractUpdateAndDate = (update: string) => {
  const [date, updateText] = update.split(', update:');
  return { date, updateText };
};

export default function AddUpdateCard({
  params,
  portal,
}: {
  params: { id: string };
  portal: PortalWithBalance;
}) {
  const { appUser } = useAppUser();
  const [richtext, setRichtext] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { addUpdatesToPortal } = usePortal();

  const { mutateAsync: updatePortal } = useMutation(addUpdatesToPortal);

  const handlePortalUpdate = () => {
    setIsLoading(true);
    const update = updateWithDate(richtext);
    console.log(extractUpdateAndDate(update));
    toast.promise(
      updatePortal({ portalId: params.id, update: updateWithDate(richtext) }),
      {
        loading: 'Adding Update',
        success: 'Update Added',
        error: 'Failed to add Update',
      },
    );
    router.push(`/portal/${params.id}`);
    setIsLoading(false);
  };

  if (appUser?.username !== portal.user.username && !appUser?.isAdmin) {
    return <NotAutherized />;
  }

  return (
    <Card>
      <h1>{portal.title}</h1>
      <h3>Add a New Update for {new Date().toDateString()}</h3>
      <TextEditor richtext={richtext} setRichtext={setRichtext} />
      <Button
        className="my-3"
        onClick={handlePortalUpdate}
        disabled={isLoading}
        loading={isLoading}
      >
        Add Update
      </Button>
    </Card>
  );
}
