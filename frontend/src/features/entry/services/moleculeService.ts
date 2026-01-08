// Molecule processing service using OpenChemLib
import { Molecule } from 'openchemlib';
import { MF } from 'mf-parser';
import type { MoleculeData } from '../types';

export interface MoleculeInput {
  type: 'molfile' | 'smiles';
  data: string;
}

/**
 * Process a molecule from molfile or SMILES and extract all relevant data
 */
export function processMolecule(input: MoleculeInput): MoleculeData {
  let molecule: ReturnType<typeof Molecule.fromMolfile>;

  if (input.type === 'molfile') {
    molecule = Molecule.fromMolfile(input.data);
  } else {
    molecule = Molecule.fromSmiles(input.data);
  }

  // Get molecular formula from OpenChemLib
  const mfString = molecule.getMolecularFormula().formula;

  // Parse formula with mf-parser for detailed info
  const mfInfo = new MF(mfString).getInfo();

  return {
    molfileV3: molecule.toMolfileV3(),
    idCode: molecule.getIDCode(),
    smiles: molecule.toSmiles(),
    molecularFormula: mfInfo.mf,
    molecularWeight: mfInfo.mass,
    monoisotopicMass: mfInfo.monoisotopicMass,
  };
}

/**
 * Process a molecule from molfile string
 */
export function processMolfile(molfile: string): MoleculeData {
  return processMolecule({ type: 'molfile', data: molfile });
}

/**
 * Process a molecule from SMILES string
 */
export function processSmiles(smiles: string): MoleculeData {
  return processMolecule({ type: 'smiles', data: smiles });
}

/**
 * Validate if a molfile is valid (has at least one atom)
 */
export function isValidMolfile(molfile: string): boolean {
  if (!molfile || !molfile.trim()) {
    return false;
  }
  try {
    const molecule = Molecule.fromMolfile(molfile);
    // Check that molecule has at least one atom
    return molecule.getAllAtoms() > 0;
  } catch {
    return false;
  }
}

/**
 * Validate if a SMILES is valid (has at least one atom)
 */
export function isValidSmiles(smiles: string): boolean {
  if (!smiles || !smiles.trim()) {
    return false;
  }
  try {
    const molecule = Molecule.fromSmiles(smiles);
    // Check that molecule has at least one atom
    return molecule.getAllAtoms() > 0;
  } catch {
    return false;
  }
}
