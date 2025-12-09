import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      
      // ORCID identification
      table.string('orcid', 19).notNullable().unique() // Format: 0000-0002-1234-5678
      
      // Profile data from ORCID
      table.string('name', 255).nullable()
      table.string('email', 254).nullable()
      table.string('institution', 255).nullable()
      
      // ORCID tokens (encrypted in production)
      table.text('access_token').nullable()
      table.text('refresh_token').nullable()
      table.timestamp('token_expires_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}