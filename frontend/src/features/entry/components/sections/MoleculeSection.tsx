// Molecule section wrapper
import { useSignals } from '@preact/signals-react/runtime';
import { Atom } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { MoleculeEditor } from '../molecule/MoleculeEditor';
import { MoleculeInfo } from '../molecule/MoleculeInfo';
import { hasSmiles, hasAttemptedSubmit } from '../../stores/entryFormStore';

export function MoleculeSection() {
  useSignals();
  const showError = hasAttemptedSubmit.value && !hasSmiles.value;

  return (
    <Card id="entry-molecule-section" className={`shadow-lg border-green-100 ${showError ? 'ring-error' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${showError ? 'bg-red-100' : 'bg-green-100'}`}>
            <Atom className={`w-5 h-5 ${showError ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">
              Chemical Structure <span className="text-red-500">*</span>
            </CardTitle>
            <CardDescription className={showError ? 'text-red-500' : 'text-slate-500'}>
              {showError ? 'A molecular structure with valid SMILES is required' : 'Draw or import the molecular structure'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <MoleculeEditor />
        <MoleculeInfo />
      </CardContent>
    </Card>
  );
}
