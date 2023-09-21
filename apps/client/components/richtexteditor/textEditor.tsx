import { Box, Button, Tabs, Text } from "@mantine/core";
import {
  IconPhoto,
  IconMessageCircle,
  IconSettings,
} from "@tabler/icons-react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { JSONContent, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import React, { useCallback, useEffect } from "react";
import { PrizeCreationTemplate } from "../Prize/prizepage/defaultcontent";

interface TextEditorProps {
  disabled?: boolean;
  richtext?: string;
  setRichtext?: (richtext: string) => void;
  canSetRichtext?: boolean;
}

export const TextEditor = ({
  disabled,
  richtext,
  setRichtext,
  canSetRichtext,
}: TextEditorProps) => {
  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: richtext,
    onUpdate: (e) => {
      if (setRichtext) {
        setRichtext(e.editor.getHTML().toString());
        console.log(richtext, "richtext");
      }
    },
  });
  console.log(richtext, "richtext");

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
};
