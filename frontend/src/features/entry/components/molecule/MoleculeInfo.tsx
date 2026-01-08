// Display molecular information
import { useSignals } from '@preact/signals-react/runtime';
import { MF } from 'react-mf';
import { useMoleculeEditor } from '../../hooks/useMoleculeEditor';

export function MoleculeInfo() {
  useSignals(); // Enable signal reactivity
  const { molecule } = useMoleculeEditor();

  if (!molecule) {
    return (
      <div className="text-sm text-muted-foreground">
        Draw a molecule to see its properties
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Molecular Formula:</span>
        <span className="font-mono">
          <MF mf={molecule.molecularFormula} />
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Molecular Weight:</span>
        <span className="font-mono">{molecule.molecularWeight.toFixed(4)} g/mol</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Monoisotopic Mass:</span>
        <span className="font-mono">{molecule.monoisotopicMass.toFixed(4)} Da</span>
      </div>
      {molecule.smiles && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">SMILES:</span>
          <span className="font-mono text-xs break-all max-w-[300px]">
            {molecule.smiles}
          </span>
        </div>
      )}
    </div>
  );
}
