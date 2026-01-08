// Entry form store using Preact Signals
import { signal, computed } from '@preact/signals-react';
import { v4 as uuidv4 } from 'uuid';
import type { Author, MoleculeData, NmrDataBundle, MassSpecDataBundle, LexicalState } from '../types';
import { user } from '../../../stores/authStore';

// Signals
export const entryId = signal<string>('');
export const title = signal<LexicalState | null>(null);
export const description = signal<LexicalState | null>(null);
export const authors = signal<Author[]>([]);
export const molecule = signal<MoleculeData | null>(null);
export const nmrData = signal<NmrDataBundle | null>(null);
export const massSpecData = signal<MassSpecDataBundle | null>(null);
export const isDirty = signal<boolean>(false);
export const isSubmitting = signal<boolean>(false);
export const hasAttemptedSubmit = signal<boolean>(false);

/**
 * Check if Lexical state has actual text content.
 * Parses the JSON state and looks for non-empty text nodes.
 */
function hasLexicalContent(state: LexicalState | null): boolean {
  if (!state) return false;
  try {
    const parsed = JSON.parse(state);
    // Check if root has children with text
    const root = parsed?.root;
    if (!root?.children) return false;
    return root.children.some((child: { children?: { text?: string }[] }) =>
      child.children?.some((node: { text?: string }) => node.text && node.text.trim().length > 0)
    );
  } catch {
    return false;
  }
}

// Computed signals
// Note: Computed signals are memoized - hasLexicalContent only runs when title.value changes
export const hasTitle = computed(() => hasLexicalContent(title.value));

export const hasSmiles = computed(() => {
  return molecule.value?.smiles !== null && molecule.value?.smiles !== undefined && molecule.value.smiles.trim() !== '';
});

export const hasMassSpecErrors = computed(() => {
  const files = massSpecData.value?.files ?? [];
  return files.some((file) => !file.isValid);
});

export const hasNmrData = computed(() => {
  return nmrData.value?.archiveBlob !== null && nmrData.value?.archiveBlob !== undefined;
});

export const hasValidMassSpecData = computed(() => {
  const files = massSpecData.value?.files ?? [];
  // Has at least one file and all files are valid
  return files.length > 0 && files.every((file) => file.isValid);
});

// Check if ANY MassBank file exists (regardless of validity)
export const hasAnyMassSpecFile = computed(() => {
  const files = massSpecData.value?.files ?? [];
  return files.length > 0;
});

export const hasAtLeastOneSpectralFile = computed(() => {
  // At least one spectral file exists (NMR or MassBank, regardless of MassBank validity)
  return hasNmrData.value || hasAnyMassSpecFile.value;
});

export const isValid = computed(() => {
  // If MassBank files are uploaded, they must all be valid
  const massSpecFilesValid = !hasMassSpecErrors.value;

  return (
    entryId.value !== '' &&
    hasTitle.value &&
    authors.value.length > 0 &&
    hasSmiles.value &&
    massSpecFilesValid &&
    hasAtLeastOneSpectralFile.value
  );
});

export const authorCount = computed(() => authors.value.length);

/**
 * Initialize the form with a new entry ID and auto-populate current user as first author
 */
export function initializeForm(): void {
  entryId.value = uuidv4();
  title.value = null;
  description.value = null;
  molecule.value = null;
  nmrData.value = null;
  massSpecData.value = null;
  isDirty.value = false;
  isSubmitting.value = false;
  hasAttemptedSubmit.value = false;

  // Auto-populate current user as first author
  const currentUser = user.value;
  if (currentUser) {
    const nameParts = (currentUser.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    authors.value = [{
      id: uuidv4(),
      firstName,
      lastName,
      affiliations: currentUser.institution
        ? [{ id: uuidv4(), name: currentUser.institution }]
        : [],
      orcid: currentUser.orcid,
      isCurrentUser: true,
      order: 0,
    }];
  } else {
    authors.value = [];
  }
}

/**
 * Reset the form to initial state
 */
export function resetForm(): void {
  entryId.value = '';
  title.value = null;
  description.value = null;
  authors.value = [];
  molecule.value = null;
  nmrData.value = null;
  massSpecData.value = null;
  isDirty.value = false;
  isSubmitting.value = false;
  hasAttemptedSubmit.value = false;
}

/**
 * Mark the form as dirty (has unsaved changes)
 */
export function markDirty(): void {
  isDirty.value = true;
}

/**
 * Set title
 */
export function setTitle(value: LexicalState | null): void {
  title.value = value;
  markDirty();
}

/**
 * Set description
 */
export function setDescription(value: LexicalState | null): void {
  description.value = value;
  markDirty();
}

/**
 * Set molecule data
 */
export function setMolecule(value: MoleculeData | null): void {
  molecule.value = value;
  markDirty();
}

/**
 * Set NMR data
 */
export function setNmrData(value: NmrDataBundle | null): void {
  nmrData.value = value;
  markDirty();
}

/**
 * Set Mass Spec data
 */
export function setMassSpecData(value: MassSpecDataBundle | null): void {
  massSpecData.value = value;
  markDirty();
}

/**
 * Entry form store object for convenient access
 */
export const entryFormStore = {
  // Signals
  entryId,
  title,
  description,
  authors,
  molecule,
  nmrData,
  massSpecData,
  isDirty,
  isSubmitting,
  hasAttemptedSubmit,
  isValid,
  authorCount,
  hasTitle,
  hasSmiles,
  hasMassSpecErrors,
  hasNmrData,
  hasValidMassSpecData,
  hasAtLeastOneSpectralFile,

  // Actions
  initializeForm,
  resetForm,
  markDirty,
  setTitle,
  setDescription,
  setMolecule,
  setNmrData,
  setMassSpecData,
};
