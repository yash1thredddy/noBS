import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'entries'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('entry_id').unique().notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text('title').notNullable()
      table.text('description').nullable()
      table.text('authors').notNullable()
      table.text('molecule').nullable()
      table.string('nmr_archive_path').nullable()
      table.text('massbank_files').nullable()
      table.string('status').defaultTo('submitted')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
