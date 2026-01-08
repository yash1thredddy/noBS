// Molecule editor component using react-ocl
import { useEffect, useRef, useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { CanvasMoleculeEditor } from 'react-ocl';
import { useMoleculeEditor } from '../../hooks/useMoleculeEditor';

export function MoleculeEditor() {
  useSignals(); // Enable signal reactivity
  const containerRef = useRef<HTMLDivElement>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const {
    molecule,
    handleMolfileChange,
    handleSmilesPaste,
  } = useMoleculeEditor();

  // Handle paste anywhere in the molecule editor container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text')?.trim();
      if (pastedText) {
        const error = handleSmilesPaste(pastedText);
        setPasteError(error);
        if (!error) {
          // Clear error after successful paste
          setTimeout(() => setPasteError(null), 2000);
        }
      }
    };

    container.addEventListener('paste', handlePaste);
    return () => container.removeEventListener('paste', handlePaste);
  }, [handleSmilesPaste]);

  return (
    <div ref={containerRef} className="space-y-2" tabIndex={0}>
      {/* Molecule Editor Canvas */}
      <div className="border rounded-lg p-4 bg-white flex justify-center">
        <div className="w-full max-w-[600px]">
          <CanvasMoleculeEditor
            inputFormat="molfile"
            inputValue={molecule?.molfileV3}
            onChange={handleMolfileChange}
            width={580}
            height={400}
          />
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-slate-500 text-center">
        Draw structure above or paste SMILES (Ctrl+V / Cmd+V)
      </p>

      {/* Paste error */}
      {pasteError && (
        <p className="text-sm text-red-600 text-center">{pasteError}</p>
      )}
    </div>
  );
}
