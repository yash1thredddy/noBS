// Hook for molecule editor state management
import { useCallback } from 'react';
import type { CanvasEditorOnChangeMolecule } from 'react-ocl';
import { molecule, setMolecule } from '../stores/entryFormStore';
import { processMolfile, processSmiles, isValidMolfile, isValidSmiles } from '../services/moleculeService';

export function useMoleculeEditor() {
  // Handle onChange event from CanvasMoleculeEditor
  const handleMolfileChange = useCallback((event: CanvasEditorOnChangeMolecule) => {
    const molfile = event.getMolfileV3();

    if (!molfile || !isValidMolfile(molfile)) {
      setMolecule(null);
      return;
    }

    try {
      const moleculeData = processMolfile(molfile);
      setMolecule(moleculeData);
    } catch (error) {
      console.error('Failed to process molecule:', error);
      setMolecule(null);
    }
  }, []);

  // Handle SMILES paste - returns error message or null if successful
  const handleSmilesPaste = useCallback((smiles: string): string | null => {
    if (!smiles.trim()) {
      return null; // Empty paste, ignore
    }

    if (!isValidSmiles(smiles.trim())) {
      return 'Invalid SMILES string';
    }

    try {
      const moleculeData = processSmiles(smiles.trim());
      setMolecule(moleculeData);
      return null; // Success
    } catch (error) {
      console.error('Failed to process SMILES:', error);
      return 'Failed to parse SMILES string';
    }
  }, []);

  const clearMolecule = useCallback(() => {
    setMolecule(null);
  }, []);

  return {
    molecule: molecule.value,
    handleMolfileChange,
    handleSmilesPaste,
    clearMolecule,
  };
}
