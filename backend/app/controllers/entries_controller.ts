import type { HttpContext } from '@adonisjs/core/http'
import Entry from '#models/entry'
import { fileStorageService } from '#services/file_storage_service'
import { createEntryValidator } from '#validators/entry'

export default class EntriesController {
  /**
   * List all entries for the authenticated user
   * GET /api/entries
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    const entries = await Entry.query()
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')

    return response.ok({ entries: entries.map((e) => e.serialize()) })
  }

  /**
   * Create a new entry
   * POST /api/entries
   */
  async store({ request, auth, response }: HttpContext) {
    const user = auth.user!

    // Validate request body using VineJS
    const payload = await request.validateUsing(createEntryValidator)

    // Check if entry already exists
    const existingEntry = await Entry.findBy('entryId', payload.entryId)
    if (existingEntry) {
      return response.conflict({ error: 'Entry with this ID already exists' })
    }

    // Handle NMR archive file
    let nmrArchivePath: string | null = null
    const nmrFile = request.file('nmrArchive', {
      extnames: ['zip'],
      size: '100mb',
    })
    if (nmrFile) {
      if (!nmrFile.isValid) {
        return response.badRequest({
          error: `Invalid NMR file: ${nmrFile.errors[0]?.message}`,
        })
      }
      nmrArchivePath = await fileStorageService.saveNmrArchive(nmrFile, payload.entryId)
      console.log('📁 Saved NMR archive:', nmrArchivePath)
    }

    // Handle MassBank files
    const massbankFilesData: { filename: string; path: string }[] = []
    let fileIndex = 0
    while (true) {
      const massbankFile = request.file(`massSpecFile_${fileIndex}`, {
        extnames: ['txt'],
        size: '10mb',
      })
      if (!massbankFile) break

      if (!massbankFile.isValid) {
        return response.badRequest({
          error: `Invalid MassBank file: ${massbankFile.errors[0]?.message}`,
        })
      }

      const filePath = await fileStorageService.saveMassbankFile(massbankFile, payload.entryId)
      massbankFilesData.push({ filename: massbankFile.clientName, path: filePath })
      console.log('📁 Saved MassBank file:', filePath)
      fileIndex++
    }

    // Create entry in database
    const entry = await Entry.create({
      entryId: payload.entryId,
      userId: user.id,
      title: payload.title,
      description: payload.description || null,
      authors: payload.authors,
      molecule: payload.molecule || null,
      nmrArchivePath,
      massbankFiles: massbankFilesData.length > 0 ? JSON.stringify(massbankFilesData) : null,
      status: 'submitted',
    })

    console.log('✅ Entry created:', entry.entryId)

    return response.created({ entry: entry.serialize() })
  }

  /**
   * Get a single entry by ID
   * GET /api/entries/:id
   */
  async show({ params, auth, response }: HttpContext) {
    const user = auth.user!

    const entry = await Entry.query()
      .where('entryId', params.id)
      .where('userId', user.id)
      .first()

    if (!entry) {
      return response.notFound({ error: 'Entry not found' })
    }

    return response.ok({ entry: entry.serialize() })
  }

  /**
   * Delete an entry
   * DELETE /api/entries/:id
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user!

    const entry = await Entry.query()
      .where('entryId', params.id)
      .where('userId', user.id)
      .first()

    if (!entry) {
      return response.notFound({ error: 'Entry not found' })
    }

    // Delete files from storage
    await fileStorageService.deleteEntryFiles(entry.entryId)
    console.log('🗑️ Deleted files for entry:', entry.entryId)

    // Delete from database
    await entry.delete()
    console.log('✅ Entry deleted:', entry.entryId)

    return response.ok({ success: true, message: 'Entry deleted' })
  }
}
