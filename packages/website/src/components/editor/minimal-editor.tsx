import { TooltipProvider } from '@radix-ui/react-tooltip'
import type { Content } from '@tiptap/react'
import { useState } from 'react'
import { MinimalTiptapEditor } from '../tiptap-editor'

export const MinimalTiptapEditorFinal = () => {
  const [value, setValue] = useState<Content>('')

  return (
    <TooltipProvider>
      <MinimalTiptapEditor
        value={value}
        onChange={setValue}
        throttleDelay={2000}
        className="w-full"
        editorContentClassName="p-5"
        output="html"
        placeholder="Type your description here..."
        autofocus={true}
        immediatelyRender={true}
        editable={true}
        injectCSS={true}
        editorClassName="focus:outline-none"
      />
    </TooltipProvider>
  )
}
