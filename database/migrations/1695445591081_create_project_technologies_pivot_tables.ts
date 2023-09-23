import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'project_technologies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('project_id').unsigned().references('projects.id').onDelete('CASCADE')
      table.integer('technology_id').unsigned().references('technologies.id').onDelete('CASCADE')
      table.primary(['technology_id', 'project_id'])  // Making the combination of both columns as the primary key
      
      /**
      * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
      */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
