import type { JSONContent } from "@tiptap/react";
import { Editor as NovalEditor } from "novel";
import type { ReactElement } from "react";
import { useState } from "react";

import { PrizeSubmissionTemplate } from "@/components/Prize/prizepage/defaultcontent";
import AppShellLayout from "@/components/layout/appshell";

function EditorsPage() {
  const [content, setContent] = useState<JSONContent | undefined>(
    PrizeSubmissionTemplate
  );

  return (
    <div className="w-full flex justify-center my-3 relative">
      <div className="relative min-h-[500px] min-w-[70vw] max-w-screen-lg border-stone-200 sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg">
        <NovalEditor
          className=""
          // className="relative min-h-[500px] min-w-[70vw] max-w-screen-lg border-stone-200 bg-white sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg"
          onUpdate={(e) => {
            setContent(e?.getJSON());
            console.log(e?.getJSON());
          }}
          defaultValue={content}
        />
        <button className="py-3 px-4 bg-gray-800 text-white absolute bottom-5 right-5 rounded-md">
          Submit Prize
        </button>
      </div>
    </div>
  );
}

EditorsPage.getLayout = function getLayout(page: ReactElement) {
  return <AppShellLayout>{page}</AppShellLayout>;
};

export default EditorsPage;
