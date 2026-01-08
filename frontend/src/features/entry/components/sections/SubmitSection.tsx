// Submit section for the entry form
import { useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Send, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import {
  isValid,
  isDirty,
  isSubmitting,
  hasAttemptedSubmit,
  hasTitle,
  hasSmiles,
  hasMassSpecErrors,
  hasAtLeastOneSpectralFile,
  entryId,
  title,
  description,
  authors,
  molecule,
  nmrData,
  massSpecData,
  initializeForm,
} from '../../stores/entryFormStore';
import { saveDraft, clearDraft } from '../../stores/draftStore';

// Section IDs for scrolling
const SECTION_IDS = {
  metadata: 'entry-metadata-section',
  authors: 'entry-authors-section',
  molecule: 'entry-molecule-section',
  nmr: 'entry-nmr-section',
  massSpec: 'entry-massspec-section',
};

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

export function SubmitSection() {
  useSignals(); // Enable signal reactivity
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSaveDraft = () => {
    saveDraft();
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    hasAttemptedSubmit.value = true;

    // Validate and scroll to first invalid field
    if (!isValid.value) {
      if (!hasTitle.value) {
        scrollToSection(SECTION_IDS.metadata);
        return;
      }
      if (authors.value.length === 0) {
        scrollToSection(SECTION_IDS.authors);
        return;
      }
      if (!hasSmiles.value) {
        scrollToSection(SECTION_IDS.molecule);
        return;
      }
      if (hasMassSpecErrors.value) {
        scrollToSection(SECTION_IDS.massSpec);
        return;
      }
      if (!hasAtLeastOneSpectralFile.value) {
        scrollToSection(SECTION_IDS.nmr);
        return;
      }
      return;
    }

    isSubmitting.value = true;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
      const token = localStorage.getItem('nobs_access_token');

      // Prepare form data for multipart upload
      const formData = new FormData();

      formData.append('entryId', entryId.value);
      formData.append('title', JSON.stringify(title.value));
      formData.append('description', JSON.stringify(description.value));
      formData.append('authors', JSON.stringify(authors.value));
      formData.append('molecule', JSON.stringify(molecule.value));

      // Add NMR data if present
      if (nmrData.value?.archiveBlob) {
        formData.append('nmrArchive', nmrData.value.archiveBlob, nmrData.value.fileName);
      }

      // Add Mass Spec data if present
      if (massSpecData.value?.files) {
        massSpecData.value.files.forEach((file, index) => {
          formData.append(`massSpecFile_${index}`, new Blob([file.content], { type: 'text/plain' }), file.originalName);
        });
      }

      const response = await fetch(`${apiUrl}/api/entries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || data.message || 'Failed to submit entry');
      }

      // Clear draft on successful submission
      clearDraft();

      // Show success message
      setSuccess('Entry submitted successfully! The form has been reset for a new entry.');

      // Reset form with new entry ID for next submission
      initializeForm();

      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      isSubmitting.value = false;
    }
  };

  return (
    <Card className="shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-slate-600">
              {isDirty.value ? (
                <span className="text-amber-600">You have unsaved changes</span>
              ) : (
                <span className="text-green-600">All changes saved</span>
              )}
            </p>
            {!isValid.value && (
              <p className="text-xs text-slate-500 mt-1">
                Complete all required fields to submit
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting.value}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting.value}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting.value ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Entry
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
