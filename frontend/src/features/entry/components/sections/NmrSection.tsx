// NMR section wrapper
import { useSignals } from '@preact/signals-react/runtime';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { NmrDropzone } from '../dropzones/NmrDropzone';
import { hasAttemptedSubmit, hasAtLeastOneSpectralFile } from '../../stores/entryFormStore';

export function NmrSection() {
  useSignals();
  const showError = hasAttemptedSubmit.value && !hasAtLeastOneSpectralFile.value;

  return (
    <Card id="entry-nmr-section" className="shadow-lg border-green-100">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${showError ? 'bg-red-100' : 'bg-green-100'}`}>
            <Activity className={`w-5 h-5 ${showError ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">
              NMR Spectra <span className="text-red-500">*</span>
            </CardTitle>
            <CardDescription className={showError ? 'text-red-500' : 'text-slate-500'}>
              {showError
                ? 'Upload NMR or MassBank data — at least one is required'
                : 'Upload NMR data files (.nmrium.zip) — NMR or MassBank required'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <NmrDropzone />
      </CardContent>
    </Card>
  );
}
