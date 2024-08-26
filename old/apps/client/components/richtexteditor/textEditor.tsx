'use client';

import { Button } from '@mantine/core';
import { Link } from '@mantine/tiptap';
import { Highlight } from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import type { AnyExtension } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { PrizeCreationTemplate } from '../Prize/prizepage/defaultcontent';
// import ReactQuill from 'react-quill';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css';
import './richtext.styles.css';

interface TextEditorProps {
  disabled?: boolean;
  richtext?: string;
  setRichtext?: (richtext: string) => void;
  canSetRichtext?: boolean;
}

export function TextEditor({
  disabled,
  richtext,
  setRichtext,
  canSetRichtext,
}: TextEditorProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    [],
  );

  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit as AnyExtension,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: richtext,
    onUpdate: (e) => {
      if (setRichtext) {
        setRichtext(e.editor.getHTML().toString());
      }
    },
  });

  const handleQuillChange = (content: string) => {
    if (setRichtext) {
      setRichtext(content);
    }
  };

  return (
    <>
      {/* <RichTextEditor editor={editor}>
        {disabled ? null : (
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}
        <RichTextEditor.Content />
      </RichTextEditor> */}

      <ReactQuill
        className="max-w-full w-full min-w-0 dont-break-out"
        value={richtext}
        onChange={handleQuillChange}
        readOnly={disabled}
        theme="snow"
        modules={{
          toolbar: disabled
            ? []
            : [
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: [1, 2, 3, 4] }],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'video'],
                [{ align: [] }],
              ],
        }}
      />
      {canSetRichtext ? (
        <Button
          className="my-2"
          color="dark.4"
          onClick={() => {
            editor?.commands.insertContent(PrizeCreationTemplate);
          }}
        >
          Use Template for Prize Description
        </Button>
      ) : null}
    </>
  );
}
