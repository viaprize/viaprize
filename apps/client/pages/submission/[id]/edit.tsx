import useAppUser from '@/components/hooks/useAppUser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Submission } from '@/lib/api';
import { Api } from '@/lib/api';
import type { JSONContent } from '@tiptap/react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Editor as NovalEditor } from 'novel';
import { useState } from 'react';

export default function SubmissionPage({
  submission,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(submission);
  const [content, setContent] = useState<JSONContent | undefined>(
    JSON.parse(submission.submissionDescription) as JSONContent,
  );
  console.log(submission.submissionDeadline);
  const subDeadline = new Date(submission.submissionDeadline * 1000);
  console.log(subDeadline);
  const { appUser } = useAppUser();

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

  if (appUser?.authId !== submission.user.authId || !submission.user.isAdmin) {
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
          You Cant Edit this Submission its past deadline
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

export const getServerSideProps = (async (context) => {
  const data = (await new Api().prizes.submissionDetail2(context.query.id as string, ''))
    .data;
  return { props: { submission: data } };
}) satisfies GetServerSideProps<{
  submission: Submission;
}>;
