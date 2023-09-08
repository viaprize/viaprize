import React, { useState } from 'react'
import { Editor as NovalEditor } from "novel";
import { JSONContent } from '@tiptap/react';
import { PrizeSubmissionTemplate } from '@/components/Prize/prizepage/defaultcontent';



function EditorsPage() {
  const [content,setContent] = useState<JSONContent | undefined>(PrizeSubmissionTemplate)

  return (
    <div className='w-full grid place-content-center my-3'>
        <NovalEditor 
        className='relative min-h-[500px] min-w-[70vw] max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg'
        onUpdate={(e)=>{
          setContent(e?.getJSON())
        }}
        defaultValue={content}
        />
    </div>
  )
}

export default EditorsPage
