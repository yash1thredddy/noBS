// Mass Spec section wrapper
import { useSignals } from '@preact/signals-react/runtime';
import { Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { MassSpecDropzone } from '../dropzones/MassSpecDropzone';
import { hasAttemptedSubmit, hasAtLeastOneSpectralFile, hasMassSpecErrors } from '../../stores/entryFormStore';

export function MassSpecSection() {
  useSignals();
  const showMissingError = hasAttemptedSubmit.value && !hasAtLeastOneSpectralFile.value;
  const showValidationError = hasAttemptedSubmit.value && hasMassSpecErrors.value;
  const showError = showMissingError || showValidationError;

  return (
    <Card id="entry-massspec-section" className="shadow-lg border-green-100">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${showError ? 'bg-red-100' : 'bg-green-100'}`}>
            <Zap className={`w-5 h-5 ${showError ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">
              Mass Spectrometry <span className="text-red-500">*</span>
            </CardTitle>
            <CardDescription className={showError ? 'text-red-500' : 'text-slate-500'}>
              {showValidationError
                ? 'Please fix validation errors in MassBank files'
                : showMissingError
                  ? 'Upload NMR or MassBank data — at least one is required'
                  : 'Upload MassBank format files (.txt) — NMR or MassBank required'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MassSpecDropzone />
      </CardContent>
    </Card>
  );
}
