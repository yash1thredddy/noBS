// Tests for useAuthors hook
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthors } from '../../hooks/useAuthors';
import { authors, resetForm } from '../../stores/entryFormStore';

// Mock uuid
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

describe('useAuthors', () => {
  beforeEach(() => {
    // Reset the store before each test
    resetForm();
    authors.value = [];
  });

  describe('addAuthor', () => {
    it('should add a new author with generated id and order', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      expect(authors.value).toHaveLength(1);
      expect(authors.value[0].firstName).toBe('John');
      expect(authors.value[0].lastName).toBe('Doe');
      expect(authors.value[0].order).toBe(0);
      expect(authors.value[0].id).toBeDefined();
    });

    it('should set correct order for multiple authors', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.addAuthor({
          firstName: 'Jane',
          lastName: 'Smith',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      expect(authors.value).toHaveLength(2);
      expect(authors.value[0].order).toBe(0);
      expect(authors.value[1].order).toBe(1);
    });
  });

  describe('updateAuthor', () => {
    it('should update an existing author', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      const authorId = authors.value[0].id;

      act(() => {
        result.current.updateAuthor(authorId, { firstName: 'Jonathan' });
      });

      expect(authors.value[0].firstName).toBe('Jonathan');
      expect(authors.value[0].lastName).toBe('Doe');
    });

    it('should not modify other authors', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.addAuthor({
          firstName: 'Jane',
          lastName: 'Smith',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      const firstAuthorId = authors.value[0].id;

      act(() => {
        result.current.updateAuthor(firstAuthorId, { firstName: 'Jonathan' });
      });

      expect(authors.value[1].firstName).toBe('Jane');
    });
  });

  describe('removeAuthor', () => {
    it('should remove an author by id', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      const authorId = authors.value[0].id;

      act(() => {
        result.current.removeAuthor(authorId);
      });

      expect(authors.value).toHaveLength(0);
    });

    it('should recalculate order values after removal', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.addAuthor({
          firstName: 'Jane',
          lastName: 'Smith',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.addAuthor({
          firstName: 'Bob',
          lastName: 'Wilson',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      const middleAuthorId = authors.value[1].id;

      act(() => {
        result.current.removeAuthor(middleAuthorId);
      });

      expect(authors.value).toHaveLength(2);
      expect(authors.value[0].order).toBe(0);
      expect(authors.value[1].order).toBe(1);
    });
  });

  describe('moveAuthorUp', () => {
    it('should swap author with the previous one', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.addAuthor({
          firstName: 'Jane',
          lastName: 'Smith',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.moveAuthorUp(1);
      });

      expect(authors.value[0].firstName).toBe('Jane');
      expect(authors.value[1].firstName).toBe('John');
      expect(authors.value[0].order).toBe(0);
      expect(authors.value[1].order).toBe(1);
    });

    it('should not move first author up', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.addAuthor({
          firstName: 'Jane',
          lastName: 'Smith',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.moveAuthorUp(0);
      });

      expect(authors.value[0].firstName).toBe('John');
      expect(authors.value[1].firstName).toBe('Jane');
    });

    it('should handle negative index gracefully', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.moveAuthorUp(-1);
      });

      expect(authors.value[0].firstName).toBe('John');
    });
  });

  describe('moveAuthorDown', () => {
    it('should swap author with the next one', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.addAuthor({
          firstName: 'Jane',
          lastName: 'Smith',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.moveAuthorDown(0);
      });

      expect(authors.value[0].firstName).toBe('Jane');
      expect(authors.value[1].firstName).toBe('John');
      expect(authors.value[0].order).toBe(0);
      expect(authors.value[1].order).toBe(1);
    });

    it('should not move last author down', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.addAuthor({
          firstName: 'Jane',
          lastName: 'Smith',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.moveAuthorDown(1);
      });

      expect(authors.value[0].firstName).toBe('John');
      expect(authors.value[1].firstName).toBe('Jane');
    });

    it('should handle out of bounds index gracefully', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
        });
      });

      act(() => {
        result.current.moveAuthorDown(10);
      });

      expect(authors.value[0].firstName).toBe('John');
    });
  });

  describe('authors with affiliations', () => {
    it('should handle authors with multiple affiliations', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [
            { id: 'aff-1', name: 'MIT' },
            { id: 'aff-2', name: 'Harvard' },
          ],
          orcid: '0000-0000-0000-0001',
          isCurrentUser: false,
        });
      });

      expect(authors.value[0].affiliations).toHaveLength(2);
      expect(authors.value[0].affiliations[0].name).toBe('MIT');
      expect(authors.value[0].affiliations[1].name).toBe('Harvard');
    });

    it('should update affiliations', () => {
      const { result } = renderHook(() => useAuthors());

      act(() => {
        result.current.addAuthor({
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [{ id: 'aff-1', name: 'MIT' }],
          orcid: null,
          isCurrentUser: false,
        });
      });

      const authorId = authors.value[0].id;

      act(() => {
        result.current.updateAuthor(authorId, {
          affiliations: [
            { id: 'aff-1', name: 'MIT' },
            { id: 'aff-2', name: 'Stanford' },
          ],
        });
      });

      expect(authors.value[0].affiliations).toHaveLength(2);
      expect(authors.value[0].affiliations[1].name).toBe('Stanford');
    });
  });
});
