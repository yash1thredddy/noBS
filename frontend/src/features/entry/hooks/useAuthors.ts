// Hook for managing authors in the entry form
import { v4 as uuidv4 } from 'uuid';
import { authors, markDirty } from '../stores/entryFormStore';
import type { Author } from '../types';

export type NewAuthor = Omit<Author, 'id' | 'order'>;

/**
 * Hook for managing authors in the entry form.
 *
 * IMPORTANT: This hook returns the current value of the authors signal, not the signal itself.
 * Components using this hook MUST call useSignals() from '@preact/signals-react/runtime'
 * to ensure proper reactivity when the authors list changes.
 *
 * @example
 * function AuthorsList() {
 *   useSignals(); // Required for reactivity
 *   const { authors, addAuthor, removeAuthor } = useAuthors();
 *   // ...
 * }
 */
export function useAuthors() {
  const addAuthor = (author: NewAuthor) => {
    const newAuthor: Author = {
      ...author,
      id: uuidv4(),
      order: authors.value.length,
    };
    authors.value = [...authors.value, newAuthor];
    markDirty();
  };

  const updateAuthor = (id: string, updates: Partial<Author>) => {
    authors.value = authors.value.map((author) =>
      author.id === id ? { ...author, ...updates } : author
    );
    markDirty();
  };

  const removeAuthor = (id: string) => {
    const filtered = authors.value.filter((author) => author.id !== id);
    // Recalculate order values
    authors.value = filtered.map((author, index) => ({
      ...author,
      order: index,
    }));
    markDirty();
  };

  const moveAuthorUp = (index: number) => {
    if (index <= 0 || index >= authors.value.length) return;

    const newAuthors = [...authors.value];
    // Swap with previous author
    [newAuthors[index - 1], newAuthors[index]] = [newAuthors[index], newAuthors[index - 1]];
    // Update order values
    authors.value = newAuthors.map((author, i) => ({
      ...author,
      order: i,
    }));
    markDirty();
  };

  const moveAuthorDown = (index: number) => {
    if (index < 0 || index >= authors.value.length - 1) return;

    const newAuthors = [...authors.value];
    // Swap with next author
    [newAuthors[index], newAuthors[index + 1]] = [newAuthors[index + 1], newAuthors[index]];
    // Update order values
    authors.value = newAuthors.map((author, i) => ({
      ...author,
      order: i,
    }));
    markDirty();
  };

  return {
    authors: authors.value,
    addAuthor,
    updateAuthor,
    removeAuthor,
    moveAuthorUp,
    moveAuthorDown,
  };
}
