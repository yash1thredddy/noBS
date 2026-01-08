// Authors section wrapper component
import { useSignals } from '@preact/signals-react/runtime';
import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { AuthorsTable } from '../authors/AuthorsTable';
import { authors, hasAttemptedSubmit } from '../../stores/entryFormStore';

export function AuthorsSection() {
  useSignals();
  const showError = hasAttemptedSubmit.value && authors.value.length === 0;

  return (
    <Card id="entry-authors-section" className="shadow-lg border-green-100">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${showError ? 'bg-red-100' : 'bg-green-100'}`}>
            <Users className={`w-5 h-5 ${showError ? 'text-red-600' : 'text-green-600'}`} />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">
              Authors <span className="text-red-500">*</span>
            </CardTitle>
            <CardDescription className={showError ? 'text-red-500' : 'text-slate-500'}>
              {showError ? 'At least one author is required' : 'Contributors to this compound entry'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AuthorsTable />
      </CardContent>
    </Card>
  );
}
