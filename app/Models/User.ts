import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, HasMany, HasOne, afterSave, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Project from './Project'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public roleId: number

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterSave()
  public static async createProfile (user: User) {
    if (user) {
      const profile = await Profile.create({
        userId: user.id,
      })
      await profile.save()
    }
  }
}
