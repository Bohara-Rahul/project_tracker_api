import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import Project from 'App/Models/Project'

export default class ProjectPolicy extends BasePolicy {
	public async viewAll(user: User) {
		return user.roleId === Role.ADMIN
	}
	
	public async view(user: User, project: Project) {
		return user.id === project.userId
	}
	
	public async update(user: User, project: Project) {
		return user.id === project.userId
	}
	public async delete(user: User, project: Project) {
		return user.id === project.userId
	}
}
