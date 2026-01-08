// Hook to warn users about unsaved changes when leaving the page
import { useEffect } from 'react';
import { isDirty } from '../stores/entryFormStore';

export function useUnsavedChangesWarning() {
  // Handle browser close/refresh with beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty.value) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but we still need to set returnValue
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Note: For in-app navigation warnings, we would need to use createBrowserRouter
  // instead of BrowserRouter. For now, only browser close/refresh is handled.
}
