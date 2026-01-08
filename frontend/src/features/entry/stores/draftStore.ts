// Draft store for localStorage persistence
import type { EntryDraft } from '../types';
import {
  entryId,
  title,
  description,
  authors,
  molecule,
} from './entryFormStore';

const DRAFT_KEY = 'nobs_entry_draft';

/**
 * Save current form state to localStorage
 */
export function saveDraft(): void {
  const draft: EntryDraft = {
    entryId: entryId.value,
    title: title.value,
    description: description.value,
    authors: authors.value,
    molecule: molecule.value,
    savedAt: Date.now(),
  };

  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

/**
 * Load draft from localStorage
 */
export function loadDraft(): EntryDraft | null {
  try {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return null;

    const draft = JSON.parse(stored) as EntryDraft;
    return draft;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

/**
 * Clear draft from localStorage
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
}

/**
 * Check if a draft exists
 */
export function hasDraft(): boolean {
  return localStorage.getItem(DRAFT_KEY) !== null;
}

/**
 * Restore draft to form state
 */
export function restoreDraft(): boolean {
  const draft = loadDraft();
  if (!draft) return false;

  entryId.value = draft.entryId;
  title.value = draft.title;
  description.value = draft.description;
  authors.value = draft.authors;
  molecule.value = draft.molecule;

  return true;
}

/**
 * Draft store object for convenient access
 */
export const draftStore = {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  restoreDraft,
};
