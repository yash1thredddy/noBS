import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import encryption from '@adonisjs/core/services/encryption'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  // ORCID identification (unique identifier from ORCID)
  @column()
  declare orcid: string

  // Profile data from ORCID
  @column()
  declare name: string | null

  @column()
  declare email: string | null

  @column()
  declare institution: string | null

  // ORCID tokens (for API calls) - Encrypted in database
  @column({
    serializeAs: null,
    prepare: (value: string | null) => {
      return value ? encryption.encrypt(value) : null
    },
    consume: (value: string | null) => {
      return value ? encryption.decrypt(value) : null
    },
  })
  declare accessToken: string | null

  @column({
    serializeAs: null,
    prepare: (value: string | null) => {
      return value ? encryption.encrypt(value) : null
    },
    consume: (value: string | null) => {
      return value ? encryption.decrypt(value) : null
    },
  })
  declare refreshToken: string | null

  @column.dateTime()
  declare tokenExpiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Access tokens for API authentication
  static accessTokens = DbAccessTokensProvider.forModel(User)

  // Serialize user data for frontend
  serialize() {
    return {
      id: this.id,
      orcid: this.orcid,
      name: this.name,
      email: this.email,
      institution: this.institution,
      createdAt: this.createdAt?.toISO(),
      updatedAt: this.updatedAt?.toISO(),
    }
  }
}