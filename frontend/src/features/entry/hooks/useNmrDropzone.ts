// Hook for NMR dropzone functionality
import { useState, useCallback } from 'react';
import { nmrData, setNmrData } from '../stores/entryFormStore';
import { processNmrFiles, clearNmrData } from '../services/nmrProcessingService';

export interface UseNmrDropzoneReturn {
  nmrData: typeof nmrData.value;
  isProcessing: boolean;
  error: string | null;
  handleDrop: (files: FileList) => Promise<void>;
  handleClear: () => void;
}

export function useNmrDropzone(): UseNmrDropzoneReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processNmrFiles(files);

      if (result.success) {
        setNmrData(result.bundle);
      } else {
        setError(result.error || 'Failed to process NMR files');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setNmrData(clearNmrData());
    setError(null);
  }, []);

  return {
    nmrData: nmrData.value,
    isProcessing,
    error,
    handleDrop,
    handleClear,
  };
}
