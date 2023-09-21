import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).notNullable()
      table.text('description').notNullable()
      table.integer('user_id').unsigned().references('users.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
