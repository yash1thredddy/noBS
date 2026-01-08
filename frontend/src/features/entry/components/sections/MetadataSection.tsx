import { useCallback } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { RichTextEditor } from '../editors/RichTextEditor';
import { setTitle, setDescription, title, description, hasTitle, hasAttemptedSubmit } from '../../stores/entryFormStore';
import type { LexicalState } from '../../types';

export function MetadataSection() {
  useSignals(); // Enable signal reactivity
  const showError = hasAttemptedSubmit.value && !hasTitle.value;

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value as LexicalState);
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setDescription(value as LexicalState);
  }, []);

  return (
    <Card id="entry-metadata-section" className="shadow-lg border-green-100">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${showError ? 'bg-red-100' : 'bg-green-100'}`}>
            <FileText className={`w-5 h-5 ${showError ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">Entry Details</CardTitle>
            <CardDescription className={showError ? 'text-red-500' : 'text-slate-500'}>
              {showError ? 'Title is required' : 'Basic information about this compound entry'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <span className="text-base font-medium text-slate-700">
            Title <span className="text-red-500">*</span>
          </span>
          <div className={showError ? 'ring-error rounded-md' : ''}>
            <RichTextEditor
              placeholder="Enter a descriptive title for this entry..."
              initialValue={title.value ?? undefined}
              onChange={handleTitleChange}
            />
          </div>
        </div>
        <div className="space-y-3">
          <span className="text-base font-medium text-slate-700">
            Description
          </span>
          <RichTextEditor
            placeholder="Provide additional details, notes, or context..."
            initialValue={description.value ?? undefined}
            onChange={handleDescriptionChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
