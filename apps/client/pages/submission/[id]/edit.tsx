// import type { Submission } from '@/lib/api';
// import { Api } from '@/lib/api';
// import { Button, Paper } from '@mantine/core';
// import type { JSONContent } from '@tiptap/react';
// import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
// import { Editor as NovalEditor } from 'novel';
// import { useState } from 'react';

// export default function SubmissionPage({
//   submission,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   console.log(submission);
//   const [content, setContent] = useState<JSONContent | undefined>(
//     JSON.parse(submission.submissionDescription) as JSONContent,
//   );
//   const startSubmissionDate = new Date(submission.prize.startSubmissionDate);

//   // Calculate the submission deadline by adding the submission days
//   const submissionDeadline = new Date(startSubmissionDate);
//   submissionDeadline.setDate(
//     submissionDeadline.getDate() + submission.prize.submissionTime,
//   );

//   if (new Date() > submissionDeadline) {
//     <Paper>You Cant Edit this Submission</Paper>;
//   }

//   return (
//     <Paper>
//       <NovalEditor
//         className=""
//         disableLocalStorage
//         defaultValue={content}
//         onUpdate={(newContent) => {
//           setContent(newContent);
//         }}
//       />
//       <Button>Update Submission</Button>
//     </Paper>
//   );
// }

// export const getServerSideProps = (async (context) => {
//   const data = (await new Api().prizes.submissionDetail2(context.query.id as string, ''))
//     .data;
//   return { props: { submission: data } };
// }) satisfies GetServerSideProps<{
//   submission: Submission;
// }>;

import React from 'react';

export default function edit() {
  return <div>edit</div>;
}
