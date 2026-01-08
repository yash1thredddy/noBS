// NMR processing service - accepts .nmrium.zip files directly
import type { NmrDataBundle } from '../types';

export interface NmrProcessingResult {
  bundle: NmrDataBundle;
  success: boolean;
  error?: string;
}

/**
 * Process an .nmrium.zip file
 * Users upload pre-prepared .nmrium.zip archives directly
 */
export async function processNmrFiles(files: FileList): Promise<NmrProcessingResult> {
  try {
    // Expect exactly one .nmrium.zip file
    if (files.length === 0) {
      return {
        bundle: { archiveBlob: null, spectraCount: 0, fileName: '' },
        success: false,
        error: 'No file selected',
      };
    }

    const file = files[0];

    // Validate file extension
    if (!file.name.endsWith('.nmrium.zip') && !file.name.endsWith('.zip')) {
      return {
        bundle: { archiveBlob: null, spectraCount: 0, fileName: '' },
        success: false,
        error: 'Please upload a .nmrium.zip file',
      };
    }

    // Read file as blob
    const archiveBlob = new Blob([await file.arrayBuffer()], { type: 'application/zip' });

    return {
      bundle: {
        archiveBlob,
        spectraCount: 1, // We don't parse the zip, just store it
        fileName: file.name,
      },
      success: true,
    };
  } catch (error) {
    return {
      bundle: { archiveBlob: null, spectraCount: 0, fileName: '' },
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process NMR file',
    };
  }
}

/**
 * Clear NMR data
 */
export function clearNmrData(): NmrDataBundle {
  return {
    archiveBlob: null,
    spectraCount: 0,
    fileName: '',
  };
}
