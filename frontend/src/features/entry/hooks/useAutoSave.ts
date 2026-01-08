// Auto-save hook with debounce
import { useEffect, useRef } from 'react';
import { useSignalEffect } from '@preact/signals-react';
import {
  entryId,
  title,
  description,
  authors,
  molecule,
  isDirty,
} from '../stores/entryFormStore';
import { saveDraft } from '../stores/draftStore';

const DEBOUNCE_MS = 2000; // 2 seconds

export function useAutoSave() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Watch for changes and auto-save with debounce
  useSignalEffect(() => {
    // Access all signals to subscribe to them
    void entryId.value;
    void title.value;
    void description.value;
    void authors.value;
    void molecule.value;

    // Only save if form is dirty
    if (!isDirty.value) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, DEBOUNCE_MS);
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}
