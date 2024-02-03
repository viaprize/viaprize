import Shell from '@/components/custom/shell';
import { TextEditor } from '@/components/richtexteditor/textEditor';
import React from 'react'

const extractUpdateAndDate = (update: string) => {
  const [date, updateText] = update.split(': update:');
  return { date, updateText };
};

function formatDateString(inputString: string): string {
  const date = new Date(inputString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };

  const formattedDate: string = date.toLocaleString('en-US', options);

  return formattedDate;
}

export default function Updates({updates}:{updates:string[]}) {

  console.log(updates, 'updates');

  return (
    <div className="my-5">
      {updates.length > 0 ? (
        updates.map((update) => (
          <div key={update.slice(10)} className="my-3 w-full max-w-[70vw]">
            <h3>{formatDateString(extractUpdateAndDate(update).date)}</h3>
            <TextEditor disabled richtext={extractUpdateAndDate(update).updateText} />
          </div>
        ))
      ) : (
        <Shell>No Updates Yet</Shell>
      )}
    </div>
  );
}
