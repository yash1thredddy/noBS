// Hook for Mass Spec dropzone functionality
import { useState, useCallback } from 'react';
import { massSpecData, setMassSpecData } from '../stores/entryFormStore';
import { validateMassBankFiles } from '../services/massBankValidationService';
import type { MassSpecFile } from '../types';

export interface UseMassSpecDropzoneReturn {
  files: MassSpecFile[];
  isProcessing: boolean;
  error: string | null;
  handleDrop: (files: File[]) => Promise<void>;
  handleRemoveFile: (fileId: string) => void;
  handleClearAll: () => void;
}

export function useMassSpecDropzone(): UseMassSpecDropzoneReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const files = massSpecData.value?.files ?? [];

  const handleDrop = useCallback(async (droppedFiles: File[]) => {
    if (droppedFiles.length === 0) return;

    // Filter for .txt files (MassBank format)
    const massBankFiles = droppedFiles.filter(
      (f) => f.name.endsWith('.txt') || f.name.endsWith('.mb')
    );

    if (massBankFiles.length === 0) {
      setError('Please drop MassBank files (.txt or .mb)');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const results = await validateMassBankFiles(massBankFiles);
      const newFiles = results.map((r) => r.file);

      // Append to existing files
      const existingFiles = massSpecData.value?.files ?? [];
      setMassSpecData({ files: [...existingFiles, ...newFiles] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process files');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleRemoveFile = useCallback((fileId: string) => {
    const currentFiles = massSpecData.value?.files ?? [];
    const updatedFiles = currentFiles.filter((f) => f.id !== fileId);
    setMassSpecData({ files: updatedFiles });
  }, []);

  const handleClearAll = useCallback(() => {
    setMassSpecData({ files: [] });
    setError(null);
  }, []);

  return {
    files,
    isProcessing,
    error,
    handleDrop,
    handleRemoveFile,
    handleClearAll,
  };
}
