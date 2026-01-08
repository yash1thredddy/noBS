import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  hasDraft,
  restoreDraft,
} from '../../stores/draftStore';
import {
  entryId,
  title,
  description,
  authors,
  molecule,
  resetForm,
} from '../../stores/entryFormStore';

// Mock the authStore
vi.mock('../../../../stores/authStore', () => ({
  user: {
    value: null,
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('draftStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    resetForm();
  });

  describe('saveDraft', () => {
    it('should save current form state to localStorage', () => {
      entryId.value = 'test-uuid';
      title.value = '{"root":{}}';
      authors.value = [
        {
          id: 'author-1',
          firstName: 'John',
          lastName: 'Doe',
          affiliations: [],
          orcid: null,
          isCurrentUser: false,
          order: 0,
        },
      ];

      saveDraft();

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'nobs_entry_draft',
        expect.any(String)
      );

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData.entryId).toBe('test-uuid');
      expect(savedData.title).toBe('{"root":{}}');
      expect(savedData.authors).toHaveLength(1);
      expect(savedData.savedAt).toBeDefined();
    });
  });

  describe('loadDraft', () => {
    it('should load draft from localStorage', () => {
      const mockDraft = {
        entryId: 'test-uuid',
        title: '{"root":{}}',
        description: null,
        authors: [],
        molecule: null,
        savedAt: Date.now(),
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockDraft));

      const loaded = loadDraft();

      expect(loaded).toEqual(mockDraft);
    });

    it('should return null when no draft exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const loaded = loadDraft();

      expect(loaded).toBeNull();
    });

    it('should return null on invalid JSON', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorageMock.getItem.mockReturnValueOnce('invalid json');

      const loaded = loadDraft();

      expect(loaded).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('clearDraft', () => {
    it('should remove draft from localStorage', () => {
      clearDraft();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('nobs_entry_draft');
    });
  });

  describe('hasDraft', () => {
    it('should return true when draft exists', () => {
      localStorageMock.getItem.mockReturnValueOnce('{}');

      expect(hasDraft()).toBe(true);
    });

    it('should return false when no draft exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      expect(hasDraft()).toBe(false);
    });
  });

  describe('restoreDraft', () => {
    it('should restore draft to form state', () => {
      const mockDraft = {
        entryId: 'restored-uuid',
        title: '{"root":{"restored":true}}',
        description: '{"desc":true}',
        authors: [
          {
            id: 'author-1',
            firstName: 'Jane',
            lastName: 'Smith',
            affiliations: [],
            orcid: '0000-0001-2345-6789',
            isCurrentUser: true,
            order: 0,
          },
        ],
        molecule: {
          molfileV3: 'test',
          idCode: 'test',
          smiles: 'CCO',
          molecularFormula: 'C2H6O',
          molecularWeight: 46.07,
          monoisotopicMass: 46.04,
        },
        savedAt: Date.now(),
      };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(mockDraft));

      const result = restoreDraft();

      expect(result).toBe(true);
      expect(entryId.value).toBe('restored-uuid');
      expect(title.value).toBe('{"root":{"restored":true}}');
      expect(description.value).toBe('{"desc":true}');
      expect(authors.value).toHaveLength(1);
      expect(authors.value[0].firstName).toBe('Jane');
      expect(molecule.value).toEqual(mockDraft.molecule);
    });

    it('should return false when no draft exists', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const result = restoreDraft();

      expect(result).toBe(false);
    });
  });
});
