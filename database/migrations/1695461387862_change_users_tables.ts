import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('github_access_token').nullable()
      table.string('google_access_token').nullable()
      table.dropNullable('password')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('github_access_token')
      table.dropColumn('google_access_token')
    })
  }
}
