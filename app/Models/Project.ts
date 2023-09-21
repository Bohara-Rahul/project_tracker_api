import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, ManyToMany, belongsTo, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Technology from './Technology'

/**
 * @swagger
 * components:
 *  schemas:
 *    Project:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        user_id:    
 *          type: number
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *        technologies:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Technology' 
 *      required:
 *        - id
 *        - name
 *        - description
 *        - user_id   
 *        - created_at
 *        - updated_at
 */

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Technology, {
    pivotTable: 'project_technologies'
  })
  public technologies: ManyToMany<typeof Technology>
}

