// Basic Lexical editor configuration
import { InitialConfigType } from '@lexical/react/LexicalComposer';

// Theme for styling editor content
const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
};

// Error handler for Lexical
function onError(error: Error): void {
  console.error('Lexical error:', error);
}

export function createEditorConfig(
  namespace: string,
  initialEditorState?: string
): InitialConfigType {
  return {
    namespace,
    theme,
    onError,
    editorState: initialEditorState || undefined,
  };
}
