import { Api } from '@/lib/api';
import React from 'react';
import SubmissionEditor from './client';

export default async function SubmissionEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const data = (await new Api().prizes.submissionDetail2(params.id, '')).data;
  return <SubmissionEditor submission={data} />;
}
