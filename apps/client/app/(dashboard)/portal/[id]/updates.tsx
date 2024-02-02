import Shell from '@/components/custom/shell';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import React from 'react'

const extractUpdateAndDate = (update: string) => {
  const [date, updateText] = update.split(', update:');
  return { date, updateText };
};

export default function Updates({updates}:{updates:string[]}) {
  return (
    <div className="my-5">
      {updates.length > 1 ? (
        updates.map((update) => (
          <div key={update.slice(10)} className="my-3 w-full max-w-[70vw]">
            <h3>{extractUpdateAndDate(update).date}</h3>
            <TextEditor disabled richtext={extractUpdateAndDate(update).updateText} />
          </div>
        ))
      ) : (
        <Shell>No Updates Yet</Shell>
      )}
    </div>
  );
}
