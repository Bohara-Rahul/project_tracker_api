import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

/**
 * @swagger
 * components:
 *  schemas:
 *    Project:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        user_id:
 *          type: number  
 *        avatar_url:
 *          type: string  
 *        created_at:
 *          type: string
 *          format: date-time
 *        updated_at:
 *          type: string
 *          format: date-time
 *      required:
 *        - id
 *        - user_id   
 *        - created_at
 *        - updated_at
 */

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  userId: number

  @column()
  avatarUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}

