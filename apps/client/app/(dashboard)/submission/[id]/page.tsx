import { Api } from '@/lib/api';
import React from 'react';
import SubmissionsClient from './client';

export default async function SubmissionPage({ params }: { params: { id: string } }) {
  const data = (await new Api().prizes.submissionDetail2(params.id , ''))
    .data;
  return <SubmissionsClient submission={data} />;
}
