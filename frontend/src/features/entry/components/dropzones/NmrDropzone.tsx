// NMR file dropzone component
import { useCallback, useRef, useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Upload, FileArchive, X, Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { useNmrDropzone } from '../../hooks/useNmrDropzone';
import { hasAttemptedSubmit, hasAtLeastOneSpectralFile } from '../../stores/entryFormStore';

export function NmrDropzone() {
  useSignals(); // Enable signal reactivity
  const { nmrData, isProcessing, error, handleDrop, handleClear } = useNmrDropzone();
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const showError = hasAttemptedSubmit.value && !hasAtLeastOneSpectralFile.value;

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

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleDrop(files);
    }
  }, [handleDrop]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleDrop(files);
    }
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [handleDrop]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  // Show processing state
  if (isProcessing) {
    return (
      <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50">
        <Loader2 className="h-10 w-10 mx-auto mb-4 text-green-600 animate-spin" />
        <p className="text-sm text-green-700">Processing NMR file...</p>
      </div>
    );
  }

  // Show uploaded data
  if (nmrData?.archiveBlob) {
    return (
      <div className="border rounded-lg p-4 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileArchive className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-slate-900">{nmrData.fileName}</p>
              <p className="text-sm text-slate-500">NMRium archive uploaded</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClear} className="hover:bg-red-100">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Show dropzone
  return (
    <div className="space-y-2">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".zip,.nmrium.zip"
        onChange={onFileSelect}
        className="hidden"
      />
      <div
        onClick={handleClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-green-500 bg-green-50'
            : showError
              ? 'border-red-500 bg-red-50 ring-error'
              : 'border-slate-300 hover:border-green-400 hover:bg-green-50/50'
        }`}
      >
        <Upload className={`h-10 w-10 mx-auto mb-4 ${isDragOver ? 'text-green-600' : showError ? 'text-red-400' : 'text-slate-400'}`} />
        <p className="text-sm font-medium mb-1 text-slate-700">Drop .nmrium.zip file here</p>
        <p className="text-xs text-slate-500">
          or click to browse
        </p>
      </div>
    </div>
  );
}
