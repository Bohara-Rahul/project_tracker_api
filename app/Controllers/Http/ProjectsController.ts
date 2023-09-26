import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Project from 'App/Models/Project';
// import Technology from 'App/Models/Technology';
// import Technology from 'App/Models/Technology';
// import CreateProjectValidator from 'App/Validators/CreateProjectValidator';

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
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

export default class ProjectsController {

   /**
   * @swagger
   * /api/projects:
   *   get:
   *     security:
   *        - bearerAuth: []
   *     tags:
   *       - Projects
   *     summary: List all projects associated with a logged in user
   *     responses:
   *       '200':
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Project'
   *       '401':
   *         description: Unauthorized  
   *       '500':
   *         description: Internal server error
   *        
   */

    public async index({ auth, response }: HttpContextContract) {
        const user = await auth.authenticate()
        if (user) {
            try {
                const projects = await Project
                    .query()
                    .where('userId', user.id)
                    // .preload('technologies')
                return response.json({ projects })
            } catch (error) {
                return response.status(404).json({ msg: "Not Authorized" })
            }
        }
        return response.status(403).json({ msg: "You are unauthenticated" })
    }

    /**
    * @swagger
    * /api/projects/{id}:
    *   get:
    *     security:
    *       - bearerAuth: []  
    *     tags: 
    *       - Projects
    *     summary: Get specific project by ID for a logged in user
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: integer
    *         description: ID of the project to return
    *     responses:
    *       '200':
    *         description: Success
    *       '404':
    *         description: Project not found  
    *                    
    */

    public async show({ bouncer, params, response }: HttpContextContract) {
        try {
            const project = await Project.findOrFail(params.id)
            await bouncer.with('ProjectPolicy').authorize('view', project)
            return project
        } catch (error) {
            return response.status(404).json({ msg: 'You are not authorized to view the project' })
        }
    }

    /**
    * @swagger
    * /api/projects:
    *   post:
    *    security:
    *       - bearerAuth: 
    *    tags:
    *      - Projects
    *    summary: Create a new Project
    *    requestBody:
    *      required: true
    *      content: 
    *        application/json:
    *          schema:
    *           type: object 
    *           properties:
    *            name: 
    *              type: string
    *              description: Name of the Project to be created
    *            description:
    *              type: string
    *              description: Description about the project
    *            technologies:
    *              type: array
    *              description: Id of the technology 
    *           required:
    *             - name
    *             - description           
    *    responses:
    *         '201':
    *            description: Project created
    *         '500':
    *            description: Internal server error             
    */

    public async create({ auth, request, response }: HttpContextContract) {
        const user = await auth.authenticate()
        const { name, description } = request.only(['name', 'description'])
        // console.log(technologies)
        
        // let addTechnologies: string[] = []
        // technologies.forEach((name: string) => addTechnologies.push(name))
        if (user) {
            const newProject = await Project.create({
                name,
                description,
                userId: user.id
            })
            // newProject.related('technologies').save(technologies)
            await newProject.save()
            return response.status(201).send(newProject)
        }
        return response.status(404).json({ error: 'Project not found' })
        
    }

    /**
     * @swagger
     * /api/projects/{id}:
     *   patch:
     *    security:
     *      - bearerAuth: []  
     *    tags:
     *      - Projects
     *    summary: Update a Project for a given id
     *    parameters:
     *      - in: path
     *        name: id
     *        required: true
     *        schema:
     *          type: integer
     *        description: ID of the project to update        
     *    requestBody:
     *      required: true
     *      content: 
     *        application/json:
     *          schema:
     *             type: object
     *             properties:
     *               name:
     *                  type: string
     *                  description: Name of the Project to be created
     *               description:
     *                  type: string
     *                  description: Description about the project      
     *    responses:
     *         '200':
     *            description: Success
     *         '404':
     *            description: Project not found            
    */

    public async update({ request, response, bouncer }: HttpContextContract) {
        const data = request.only(['name', 'description'])
        const project = await Project.findOrFail(request.param('id'))
        await bouncer.with('ProjectPolicy').authorize('update', project)
        project.merge(data)
        try {
            await project.save()
            return response.status(200).json({ msg: 'Project updated successfully'})
        } catch (error) {
            return response.status(404).json({ msg: 'Project not found' })
        }
        
    }

    /**
     * @swagger
     * /api/projects/{id}:
     *   delete:
     *    security:
     *      - bearerAuth: []  
     *    tags:
     *      - Projects
     *    summary: Delete a Project with a given id
     *    parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID of the project to delete
     *    responses:
     *         '200':
     *            description: Success
     *         '404':
     *            description: Project not found            
    */

    public async delete({ bouncer, request, response }: HttpContextContract) {
        const project = await Project.findOrFail(request.param('id'))
        await bouncer.with('ProjectPolicy').authorize('delete', project)
        await project.delete()
        response.status(200).json({ msg: 'Project successfully deleted' })
    } 

}

