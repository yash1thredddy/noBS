import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Entry extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare entryId: string

  @column()
  declare userId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare authors: string

  @column()
  declare molecule: string | null

  @column()
  declare nmrArchivePath: string | null

  @column()
  declare massbankFiles: string | null

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  serialize() {
    return {
      id: this.id,
      entryId: this.entryId,
      userId: this.userId,
      title: this.title,
      description: this.description,
      authors: JSON.parse(this.authors),
      molecule: this.molecule ? JSON.parse(this.molecule) : null,
      nmrArchivePath: this.nmrArchivePath,
      massbankFiles: this.massbankFiles ? JSON.parse(this.massbankFiles) : [],
      status: this.status,
      createdAt: this.createdAt.toISO(),
      updatedAt: this.updatedAt.toISO(),
    }
  }
}
