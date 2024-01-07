import { Button } from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { Highlight } from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import type { AnyExtension } from '@tiptap/react';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { PrizeCreationTemplate } from '../Prize/prizepage/defaultcontent';

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

  return (
    <>
      <RichTextEditor editor={editor}>
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
      </RichTextEditor>
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
