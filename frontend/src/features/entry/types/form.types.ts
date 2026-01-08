// Form state types
import type { Author, MoleculeData, NmrDataBundle, MassSpecDataBundle, LexicalState } from './entry.types';

export interface EntryFormState {
  entryId: string;
  title: LexicalState | null;
  description: LexicalState | null;
  authors: Author[];
  molecule: MoleculeData | null;
  nmrData: NmrDataBundle | null;
  massSpecData: MassSpecDataBundle | null;
  isDirty: boolean;
  isSubmitting: boolean;
}

export interface EntryDraft {
  entryId: string;
  title: LexicalState | null;
  description: LexicalState | null;
  authors: Author[];
  molecule: MoleculeData | null;
  // Note: Blob data is not serializable, so we don't store nmrData/massSpecData in draft
  savedAt: number;
}
