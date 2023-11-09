import { Api, Submission } from '@/lib/api';
import { Paper } from '@mantine/core';
import { JSONContent } from '@tiptap/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Editor as NovalEditor } from 'novel';
export default function SubmissionPage({
  submission,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(submission);
  return (
    <Paper>
      {/* <div className="w-full flex justify-center my-3 relative">
             <div className="relative  min-w-[70vw] max-w-screen-lg border-stone-200 sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg">
                   
                </div>
            </div> * */}
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
  const data = (await new Api().prizes.submissionDetail(context.query.id as string)).data;
  return { props: { submission: data } };
}) satisfies GetServerSideProps<{
  submission: Submission;
}>;
