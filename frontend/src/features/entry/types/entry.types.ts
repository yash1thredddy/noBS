// Entry-related types

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  affiliations: Affiliation[];
  orcid: string | null;
  isCurrentUser: boolean;
  order: number;
}

export interface Affiliation {
  id: string;
  name: string;
}

export interface MoleculeData {
  molfileV3: string;
  idCode: string;
  smiles: string | null;
  molecularFormula: string;
  molecularWeight: number;
  monoisotopicMass: number;
}

export interface NmrDataBundle {
  archiveBlob: Blob | null;
  spectraCount: number;
  fileName: string;
}

export interface MassSpecFile {
  id: string;
  originalName: string;
  content: string;
  isValid: boolean;
  errors: MassSpecValidationError[];
  warnings: MassSpecValidationWarning[];
}

export interface MassSpecValidationError {
  message: string;
  line?: number;
  column?: number;
  type?: 'parse' | 'validation' | 'serialization' | 'duplicate' | 'other';
}

export interface MassSpecValidationWarning {
  message: string;
  line?: number;
  column?: number;
}

export interface MassSpecDataBundle {
  files: MassSpecFile[];
}

// Lexical editor state type (serialized JSON)
export type LexicalState = string;

export interface Entry {
  id: string;
  title: LexicalState | null;
  description: LexicalState | null;
  authors: Author[];
  molecule: MoleculeData | null;
  nmrData: NmrDataBundle | null;
  massSpecData: MassSpecDataBundle | null;
}
