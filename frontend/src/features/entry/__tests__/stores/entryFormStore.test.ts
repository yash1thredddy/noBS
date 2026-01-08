import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  entryId,
  title,
  description,
  authors,
  molecule,
  nmrData,
  massSpecData,
  isDirty,
  isSubmitting,
  isValid,
  authorCount,
  initializeForm,
  resetForm,
  markDirty,
  setTitle,
  setDescription,
  setMolecule,
} from '../../stores/entryFormStore';

// Mock the authStore
vi.mock('../../../../stores/authStore', () => ({
  user: {
    value: {
      orcid: '0000-0001-2345-6789',
      name: 'John Doe',
      email: 'john@example.com',
      institution: 'Test University',
    },
  },
}));

describe('entryFormStore', () => {
  beforeEach(() => {
    resetForm();
  });

  describe('initializeForm', () => {
    it('should generate UUID on initialize', () => {
      initializeForm();
      expect(entryId.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should auto-populate current user as first author', () => {
      initializeForm();
      expect(authors.value).toHaveLength(1);
      expect(authors.value[0].firstName).toBe('John');
      expect(authors.value[0].lastName).toBe('Doe');
      expect(authors.value[0].orcid).toBe('0000-0001-2345-6789');
      expect(authors.value[0].isCurrentUser).toBe(true);
      expect(authors.value[0].order).toBe(0);
    });

    it('should include user institution as affiliation', () => {
      initializeForm();
      expect(authors.value[0].affiliations).toHaveLength(1);
      expect(authors.value[0].affiliations[0].name).toBe('Test University');
    });

    it('should reset isDirty to false', () => {
      isDirty.value = true;
      initializeForm();
      expect(isDirty.value).toBe(false);
    });
  });

  describe('resetForm', () => {
    it('should reset all state', () => {
      initializeForm();
      setTitle('{"root":{}}');
      markDirty();

      resetForm();

      expect(entryId.value).toBe('');
      expect(title.value).toBeNull();
      expect(description.value).toBeNull();
      expect(authors.value).toEqual([]);
      expect(molecule.value).toBeNull();
      expect(nmrData.value).toBeNull();
      expect(massSpecData.value).toBeNull();
      expect(isDirty.value).toBe(false);
      expect(isSubmitting.value).toBe(false);
    });
  });

  describe('markDirty', () => {
    it('should set isDirty to true', () => {
      expect(isDirty.value).toBe(false);
      markDirty();
      expect(isDirty.value).toBe(true);
    });
  });

  describe('setTitle', () => {
    it('should set title and mark form as dirty', () => {
      const lexicalState = '{"root":{"children":[]}}';
      setTitle(lexicalState);
      expect(title.value).toBe(lexicalState);
      expect(isDirty.value).toBe(true);
    });
  });

  describe('setDescription', () => {
    it('should set description and mark form as dirty', () => {
      const lexicalState = '{"root":{"children":[]}}';
      setDescription(lexicalState);
      expect(description.value).toBe(lexicalState);
      expect(isDirty.value).toBe(true);
    });
  });

  describe('setMolecule', () => {
    it('should set molecule and mark form as dirty', () => {
      const moleculeData = {
        molfileV3: 'test',
        idCode: 'test',
        smiles: 'CCO',
        molecularFormula: 'C2H6O',
        molecularWeight: 46.07,
        monoisotopicMass: 46.04,
      };
      setMolecule(moleculeData);
      expect(molecule.value).toEqual(moleculeData);
      expect(isDirty.value).toBe(true);
    });
  });

  describe('computed: isValid', () => {
    it('should return false when form is empty', () => {
      expect(isValid.value).toBe(false);
    });

    it('should return false when only entryId is set', () => {
      initializeForm();
      // Has entryId and authors, but no molecule
      expect(isValid.value).toBe(false);
    });

    it('should return true when required fields are set', () => {
      initializeForm();
      setMolecule({
        molfileV3: 'test',
        idCode: 'test',
        smiles: 'CCO',
        molecularFormula: 'C2H6O',
        molecularWeight: 46.07,
        monoisotopicMass: 46.04,
      });
      expect(isValid.value).toBe(true);
    });
  });

  describe('computed: authorCount', () => {
    it('should return 0 when no authors', () => {
      expect(authorCount.value).toBe(0);
    });

    it('should return correct count after initialization', () => {
      initializeForm();
      expect(authorCount.value).toBe(1);
    });
  });
});
