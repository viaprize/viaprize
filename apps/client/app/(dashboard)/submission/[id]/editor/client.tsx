'use client';

import useAppUser from '@/components/hooks/useAppUser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { FetchSubmissionDto, Submission } from '@/lib/api';
import { Api } from '@/lib/api';
import { backendApi } from '@/lib/backend';
import type { JSONContent } from '@tiptap/react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Editor as NovalEditor } from 'novel';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SubmissionEditor({
  submission,
}: {
  submission: FetchSubmissionDto;
}) {
  console.log(submission);
  const [content, setContent] = useState<JSONContent | undefined>(
    JSON.parse(submission.submissionDescription) as JSONContent,
  );
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  console.log(submission.submissionDeadline);
  const subDeadline = new Date(submission.submissionDeadline * 1000);
  console.log(subDeadline);
  const { appUser } = useAppUser();

  const onSubmit = async () => {
    setLoading(true);
    console.log(content);
    console.log(submission.id);
    toast.promise(
      (await backendApi()).prizes.submissionPartialUpdate(
        submission.id,
        JSON.stringify(content),
      ),
      {
        loading: 'Updating Submission',
        success: 'Submission Updated',
        error: (e) => `Error Updating Submission ${e?.response?.data?.message}`,
      },
    );
    await router.push(`/submission/${submission.id}`);
    setLoading(false);
  };

  console.log(appUser, 'app');

  // Calculate the submission deadline by adding the submission days

  if (!appUser) {
    return (
      <div className="w-screen h-[50vh] flex justify-center items-center">
        <Card className="max-h-[20vh] flex justify-center items-center p-16 text-xl font-bold">
          You are not Autherized to edit this, please login
        </Card>
      </div>
    );
  }

  if (appUser?.authId !== submission.user.authId && !appUser.isAdmin) {
    return (
      <div className="w-screen h-[50vh] flex justify-center items-center">
        <Card className="max-h-[20vh] flex justify-center items-center p-16 text-xl font-bold">
          You are not Autherized to edit this
        </Card>
      </div>
    );
  }

  if (new Date() > subDeadline || submission.submissionDeadline === 0) {
    return (
      <div className="w-screen h-[50vh] flex justify-center items-center">
        <Card className="max-h-[20vh] flex justify-center items-center p-16 text-xl font-bold">
          You Can not Edit this Submission its past deadline
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-3  justify-center my-3 relative">
      <div
        className="relative min-h-[500px] min-w-[70vw] rounded-lg max-w-screen-lg border-stone-200 sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg"
        style={{
          borderRadius: '0.375rem',
        }}
      >
        {submission.prize.startSubmissionDate}
        <NovalEditor
          className=""
          disableLocalStorage
          defaultValue={content}
          onUpdate={(newContent) => {
            setContent(newContent);
          }}
        />
      </div>
      <Button
        onClick={onSubmit}
        disabled={loading}
        className="bg-blue-500  text-white hover:bg-blue-600"
        style={{
          borderRadius: '0.375rem',
        }}
      >
        Update Submission
      </Button>
    </div>
  );
}
