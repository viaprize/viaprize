import { Api } from '@/lib/api';
import React from 'react';
import SubmissionEditor from './client';

export default async function SubmissionEditorPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = (await new Api().prizes.submissionDetail2(params.slug, '')).data;
  return <SubmissionEditor submission={data} />;
}
