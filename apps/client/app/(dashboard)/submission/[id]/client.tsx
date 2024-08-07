'use client';

import type { Submission } from '@/lib/api';
import { Api } from '@/lib/api';
import { Paper } from '@mantine/core';
import type { JSONContent } from '@tiptap/react';
import { Editor as NovalEditor } from 'novel';

export default function SubmissionsClient({ submission }: { submission: Submission }) {

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
