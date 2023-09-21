import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Project from './Project'

/**
 * @swagger
 * components:
 *  schemas:
 *    Technology:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *        projects:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Project' 
 *      required:
 *        - id
 *        - name   
 *        - created_at
 *        - updated_at
 */

export default class Technology extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Project, {
    pivotTable: 'project_technologies'
  })
  public projects: ManyToMany<typeof Project>
}

