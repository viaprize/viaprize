import React, { useState } from 'react';
import { Editor as NovalEditor } from 'novel';
import { JSONContent } from '@tiptap/react';
import { PrizeSubmissionTemplate } from '@/components/Prize/prizepage/defaultcontent';
import { Button } from '@mantine/core';
import AppShellLayout from '@/components/layout/appshell';

function EditorsPage() {
  const [content, setContent] = useState<JSONContent | undefined>(PrizeSubmissionTemplate);

  return (
    <AppShellLayout>
    <div className="w-full flex justify-center my-3 relative">
      <div
        className='relative min-h-[500px] min-w-[70vw] max-w-screen-lg border-stone-200 bg-white sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg'
      >
        <NovalEditor
        className=''
          // className="relative min-h-[500px] min-w-[70vw] max-w-screen-lg border-stone-200 bg-white sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg"
          onUpdate={(e) => {
            setContent(e?.getJSON());
          }}
          defaultValue={content}
        />
        <button className="py-3 px-4 bg-gray-800 text-white absolute bottom-5 right-5 rounded-md">
          Submit Prize
        </button>
      </div>
    </div>
    </AppShellLayout>
  );
}

export default EditorsPage;
