import { Button, Title } from '@mantine/core';
import React from 'react';
import SubmissionsCard from './submissionsCard';

export default function Submissions() {
  return (
    <div className="w-full flex flex-col gap-3">
      <Button component="a" w="40%" className="self-end" href="/prize/editor">
        Submit your work
      </Button>
      <Title order={3} style={{ textAlign: 'left' }}>
        Submissions
      </Title>
      <SubmissionsCard
        fullname="testing name"
        submission="hello thsi sht etex ofdsafljshfkjas"
        wallet="fasddskjvhksjdvfsda"
        time="10:2342"
        votes={0}
        submissionId="faskj"
      />
    </div>
  );
}
