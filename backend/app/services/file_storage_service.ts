import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import app from '@adonisjs/core/services/app'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export class FileStorageService {
  private dataDir: string

  constructor() {
    this.dataDir = app.makePath('data')
  }

  /**
   * Get prefix from entryId (first 2 characters)
   */
  private getPrefix(entryId: string): string {
    return entryId.substring(0, 2).toLowerCase()
  }

  /**
   * Get the entry base directory: data/{prefix}/{entryId}
   */
  getEntryDir(entryId: string): string {
    return join(this.dataDir, this.getPrefix(entryId), entryId)
  }

  /**
   * Get directory for a specific type: data/{prefix}/{entryId}/{type}
   */
  getTypeDir(entryId: string, type: 'nmr' | 'massbank'): string {
    return join(this.getEntryDir(entryId), type)
  }

  /**
   * Save NMR archive to: data/{prefix}/{entryId}/nmr/{filename}
   */
  async saveNmrArchive(file: MultipartFile, entryId: string): Promise<string> {
    const dir = this.getTypeDir(entryId, 'nmr')
    await file.move(dir, { name: file.clientName })

    if (!file.filePath) {
      throw new Error('Failed to save NMR archive')
    }
    return file.filePath
  }

  /**
   * Save MassBank file to: data/{prefix}/{entryId}/massbank/{filename}
   */
  async saveMassbankFile(file: MultipartFile, entryId: string): Promise<string> {
    const dir = this.getTypeDir(entryId, 'massbank')
    await file.move(dir, { name: file.clientName })

    if (!file.filePath) {
      throw new Error('Failed to save MassBank file')
    }
    return file.filePath
  }

  /**
   * Delete entire entry directory: data/{prefix}/{entryId}
   */
  async deleteEntryFiles(entryId: string): Promise<void> {
    const entryDir = this.getEntryDir(entryId)
    await rm(entryDir, { recursive: true, force: true })
  }
}

// Singleton instance
export const fileStorageService = new FileStorageService()
