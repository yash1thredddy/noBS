// Mass Spec file dropzone component
import { useCallback, useRef, useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Upload, X, Loader2, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { useMassSpecDropzone } from '../../hooks/useMassSpecDropzone';
import { hasAttemptedSubmit, hasAtLeastOneSpectralFile, hasMassSpecErrors } from '../../stores/entryFormStore';
import type { MassSpecFile } from '../../types';

function FileItem({ file, onRemove }: { file: MassSpecFile; onRemove: () => void }) {
  const hasWarningsOnly = file.warnings.length > 0 && file.errors.length === 0;

  return (
    <div className="flex items-start justify-between p-3 border rounded-lg bg-white">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="mt-0.5">
          {file.isValid && !hasWarningsOnly ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : file.isValid && hasWarningsOnly ? (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate text-slate-900">{file.originalName}</p>
          {/* Show all errors */}
          {file.errors.length > 0 && (
            <div className="mt-1 space-y-1">
              {file.errors.map((err, i) => (
                <p key={i} className="text-xs text-red-600">
                  {err.line ? `Line ${err.line}: ` : ''}{err.message}
                </p>
              ))}
            </div>
          )}
          {/* Show all warnings */}
          {file.warnings.length > 0 && (
            <div className="mt-1 space-y-1">
              {file.warnings.map((warn, i) => (
                <p key={i} className="text-xs text-yellow-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  {warn.line ? `Line ${warn.line}: ` : ''}{warn.message}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function MassSpecDropzone() {
  useSignals(); // Enable signal reactivity
  const { files, isProcessing, error, handleDrop, handleRemoveFile, handleClearAll } = useMassSpecDropzone();
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const showError = hasAttemptedSubmit.value && (!hasAtLeastOneSpectralFile.value || hasMassSpecErrors.value);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const onDropHandler = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleDrop(droppedFiles);
    }
  }, [handleDrop]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleDrop(Array.from(selectedFiles));
    }
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [handleDrop]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const validCount = files.filter((f) => f.isValid).length;
  const invalidCount = files.filter((f) => !f.isValid).length;
  const warningCount = files.reduce((sum, f) => sum + f.warnings.length, 0);

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".txt,.mb"
        multiple
        onChange={onFileSelect}
        className="hidden"
      />
      <div
        onClick={handleClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDropHandler}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-green-500 bg-green-50'
            : showError
              ? 'border-red-500 bg-red-50 ring-error'
              : 'border-slate-300 hover:border-green-400 hover:bg-green-50/50'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-8 w-8 mx-auto mb-3 text-green-600 animate-spin" />
            <p className="text-sm text-green-700">Validating files...</p>
          </>
        ) : (
          <>
            <Upload className={`h-8 w-8 mx-auto mb-3 ${isDragOver ? 'text-green-600' : showError ? 'text-red-400' : 'text-slate-400'}`} />
            <p className="text-sm font-medium mb-1 text-slate-700">Drop MassBank files here</p>
            <p className="text-xs text-slate-500">
              or click to browse (.txt, .mb)
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-500">
                {files.length} file{files.length !== 1 ? 's' : ''}
              </span>
              {validCount > 0 && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  {validCount} valid
                </span>
              )}
              {invalidCount > 0 && (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {invalidCount} invalid
                </span>
              )}
              {warningCount > 0 && (
                <span className="flex items-center gap-1 text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  {warningCount} warning{warningCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-slate-500 hover:text-red-600">
              Clear all
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onRemove={() => handleRemoveFile(file.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
