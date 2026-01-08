// Tests for moleculeService
import { describe, it, expect } from 'vitest';
import {
  processMolecule,
  processMolfile,
  processSmiles,
  isValidMolfile,
  isValidSmiles,
} from '../../services/moleculeService';

// Sample ethanol molfile (V2000 format)
const ethanolMolfile = `
  Mrv2311 12271234562D

  3  2  0  0  0  0            999 V2000
    0.0000    0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.4289    0.8250    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  1  0  0  0  0
M  END
`;

describe('moleculeService', () => {
  describe('processMolecule', () => {
    it('should process SMILES input', () => {
      const result = processMolecule({ type: 'smiles', data: 'CCO' });

      expect(result.molecularFormula).toBe('C2H6O');
      expect(result.molecularWeight).toBeCloseTo(46.07, 1);
      expect(result.monoisotopicMass).toBeCloseTo(46.04, 1);
      expect(result.molfileV3).toContain('V3000');
      expect(result.idCode).toBeDefined();
      expect(result.smiles).toBeDefined();
    });

    it('should process molfile input', () => {
      const result = processMolecule({ type: 'molfile', data: ethanolMolfile });

      expect(result.molecularFormula).toBeDefined();
      expect(result.molecularWeight).toBeGreaterThan(0);
      expect(result.molfileV3).toContain('V3000');
    });
  });

  describe('processMolfile', () => {
    it('should process a valid molfile', () => {
      const result = processMolfile(ethanolMolfile);

      expect(result.molfileV3).toBeDefined();
      expect(result.idCode).toBeDefined();
    });
  });

  describe('processSmiles', () => {
    it('should process benzene', () => {
      const result = processSmiles('c1ccccc1');

      expect(result.molecularFormula).toBe('C6H6');
      expect(result.molecularWeight).toBeCloseTo(78.11, 1);
    });

    it('should process caffeine', () => {
      const result = processSmiles('Cn1cnc2c1c(=O)n(c(=O)n2C)C');

      expect(result.molecularFormula).toBe('C8H10N4O2');
      expect(result.molecularWeight).toBeCloseTo(194.19, 1);
    });

    it('should process aspirin', () => {
      const result = processSmiles('CC(=O)Oc1ccccc1C(=O)O');

      expect(result.molecularFormula).toBe('C9H8O4');
      expect(result.molecularWeight).toBeCloseTo(180.16, 1);
    });
  });

  describe('isValidMolfile', () => {
    it('should return true for valid molfile', () => {
      expect(isValidMolfile(ethanolMolfile)).toBe(true);
    });

    it('should return false for invalid molfile', () => {
      expect(isValidMolfile('invalid molfile content')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidMolfile('')).toBe(false);
    });
  });

  describe('isValidSmiles', () => {
    it('should return true for valid SMILES', () => {
      expect(isValidSmiles('CCO')).toBe(true);
      expect(isValidSmiles('c1ccccc1')).toBe(true);
    });

    it('should return false for invalid SMILES', () => {
      expect(isValidSmiles('not a smiles')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidSmiles('')).toBe(false);
    });
  });
});
