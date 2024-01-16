import { useColorScheme } from '@mantine/hooks';
import Document from '@tiptap/extension-document';
import { generateJSON } from '@tiptap/html';
import { Editor as NovalEditor } from 'novel';
import { useMemo } from 'react';
import { PrizeCreationTemplate } from '../Prize/prizepage/defaultcontent';

interface TextEditorProps {
  disabled?: boolean;
  richtext?: string;
  setRichtext?: (richtext: string) => void;
  canSetRichtext?: boolean;
}

export default function NovelEditor({
  disabled,
  richtext,
  setRichtext,
  canSetRichtext,
}: TextEditorProps) {
  const colorScheme = useColorScheme();

  // const output = useMemo(() => {
  //   return generateJSON(PrizeCreationTemplate, [Document]);
  // }, []);
  // console.log(output);

  return (
      <NovalEditor
        disableLocalStorage
        editorProps={{
          editable: () => !disabled,
        }}
        className={`relative min-h-[500px]
          w-full
          ${
            colorScheme === 'dark'
              ? '!bg-zinc-900 border-gray-700'
              : '!bg-slate-100 border-gray-300'
          }
          sm:pb-[calc(10vh)] sm:rounded-lg sm:border sm:shadow-lg`}
        onUpdate={(e) => {
          setRichtext?.(e?.getHTML() || '');
        }}

        defaultValue={PrizeCreationTemplate}
      />
  );
}
