import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Technology from 'App/Models/Technology'
import CreateTechnologyValidator from 'App/Validators/CreateTechnologyValidator'

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
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

export default class TechnologiesController {
   /**
   * @swagger
   * /api/technologies:
   *   get:
   *     security:
   *        - bearerAuth: []   
   *     tags:
   *       - Technologies
   *     summary: List all technologies
   *     responses:
   *       '200':
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Technology'
   *       '401':
   *         description: Unauthorized  
   *       '500':
   *         description: Internal server error
   *        
   */

    public async index({ auth, response }: HttpContextContract) {
        const user = await auth.authenticate()

        if (user) {
            const technologies = await Technology.all()
            return technologies
        }
        response.status(400).badRequest()
    }


    /**
    * @swagger
    * /api/technologies:
    *   post:
    *    security:
    *       - bearerAuth: []   
    *    tags:
    *      - Technologies
    *    summary: Create a new Technology
    *    requestBody:
    *      required: true
    *      content:
    *       application/json:
    *           schema:
    *             type: object
    *             properties:
    *               name:
    *                 type: string
    *                 description: Name of the technology
    *                 required: true  
    *    responses:
    *         '201':
    *            description: Technology created
    *         '500':
    *            description: Internal server error             
    */
    public async create({ auth, request, response }: HttpContextContract) {
        const user = await auth.authenticate()

        if (user) {
            try {
                const { name } = await request.validate(CreateTechnologyValidator)
                const newTechnology = await Technology.create({
                    name
                })
                await newTechnology.save()
                return response.status(201).json(newTechnology)
            } catch (error) {
                response.json({ msg: "This technology has already been created"})
            }
        }
        return response.status(401).json({ msg: 'You are unauthorized' })
        
    }
}

