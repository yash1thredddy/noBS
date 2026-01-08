import { useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { EditorState } from 'lexical';
import { createEditorConfig } from './LexicalConfig';

export interface RichTextEditorProps {
  placeholder?: string;
  initialValue?: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({
  placeholder = 'Enter text...',
  initialValue,
  onChange,
}: RichTextEditorProps) {
  const handleChange = useCallback(
    (editorState: EditorState) => {
      const json = editorState.toJSON();
      onChange(JSON.stringify(json));
    },
    [onChange]
  );

  const initialConfig = createEditorConfig('RichTextEditor', initialValue);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative border rounded-md bg-background">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[80px] px-3 py-2 text-sm focus:outline-none"
              aria-placeholder={placeholder}
              placeholder={
                <div className="absolute top-2 left-3 text-muted-foreground text-sm pointer-events-none">
                  {placeholder}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}
