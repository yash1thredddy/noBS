import vine from '@vinejs/vine'

/**
 * Validator for creating a new entry
 */
export const createEntryValidator = vine.compile(
  vine.object({
    entryId: vine.string().uuid(),
    title: vine.string().minLength(1),
    description: vine.string().nullable().optional(),
    authors: vine.string().minLength(1), // JSON string of authors array
    molecule: vine.string().nullable().optional(), // JSON string of molecule data
  })
)

/**
 * Validator for updating an entry (all fields optional except id)
 */
export const updateEntryValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(1).optional(),
    description: vine.string().nullable().optional(),
    authors: vine.string().minLength(1).optional(),
    molecule: vine.string().nullable().optional(),
    status: vine.enum(['draft', 'submitted', 'published']).optional(),
  })
)
