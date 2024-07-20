'use client'

import type { Submission } from '@/lib/api';
import { Api } from '@/lib/api';
import { Paper } from '@mantine/core';
import type { JSONContent } from '@tiptap/react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Editor as NovalEditor } from 'novel';

export default function SubmissionPage({
  submission,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(submission);
  return (
    <Paper>
      <NovalEditor
        className=""
        disableLocalStorage
        editorProps={{
          editable: () => false,
        }}
        defaultValue={JSON.parse(submission.submissionDescription) as JSONContent}
      />
    </Paper>
  );
}

export const getServerSideProps = (async (context) => {
  const data = (await new Api().prizes.submissionDetail2(context.query.id as string, ''))
    .data;
  return { props: { submission: data } };
}) satisfies GetServerSideProps<{
  submission: Submission;
}>;
