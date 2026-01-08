// MassBank validation service using the massbank npm package
import { validateContent } from 'massbank';
import { v4 as uuidv4 } from 'uuid';
import type { MassSpecFile, MassSpecValidationError, MassSpecValidationWarning } from '../types';

export interface ValidationResult {
  file: MassSpecFile;
  success: boolean;
}

/**
 * Validate a MassBank file using the massbank npm package
 */
export async function validateMassBankFile(file: File): Promise<ValidationResult> {
  try {
    const content = await file.text();
    const result = await validateContent(content, file.name);

    // Map massbank package types to our internal types
    const errors: MassSpecValidationError[] = result.errors.map((err) => ({
      message: err.message,
      line: err.line,
      column: err.column,
      type: err.type,
    }));

    const warnings: MassSpecValidationWarning[] = result.warnings.map((warn) => ({
      message: warn.message,
      line: warn.line,
      column: warn.column,
    }));

    return {
      file: {
        id: uuidv4(),
        originalName: file.name,
        content,
        isValid: result.success,
        errors,
        warnings,
      },
      success: result.success,
    };
  } catch (error) {
    return {
      file: {
        id: uuidv4(),
        originalName: file.name,
        content: '',
        isValid: false,
        errors: [{
          message: error instanceof Error ? error.message : 'Failed to validate file',
          type: 'other',
        }],
        warnings: [],
      },
      success: false,
    };
  }
}

/** Maximum concurrent validations to prevent browser overload */
const BATCH_SIZE = 5;

/**
 * Validate multiple MassBank files with controlled concurrency
 */
export async function validateMassBankFiles(files: File[]): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(validateMassBankFile));
    results.push(...batchResults);
  }

  return results;
}
