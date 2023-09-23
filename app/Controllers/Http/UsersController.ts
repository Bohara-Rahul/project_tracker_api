import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */

export default class UsersController {
    /**
	* @swagger
	* /api/register:
	*   post:
	*     tags:
	*       - Users
    *     summary: Register a User 
	*     requestBody:
	*       required: true         
	*       content:
	*         application/json:
	*           description: User payload
	*           schema:
	*             type: object
	*             properties:
	*               name:
	*                 type: string
	*                 example: 'John Doe'
	*                 required: true
	*               email:
	*                 type: string
	*                 example: 'john@example.com'
	*                 required: true
    *               password:
    *                 type: string
    *                 example: 'MySecretPassword'
    *                 required: true  
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Success
	*         content:
	*           application/json:
	*             schema:
	*               $ref: '#/components/schemas/User'
    *       400:
    *         description: Bad Request
	*/
    
    public async register({ auth, request, response }: HttpContextContract) { 
        const { name, email, password } = await request.validate(RegisterValidator)
        const newUser = await User.create({
            name, email, password
        })
        try {
            await newUser.save()
            const token = await auth.use("api").login(newUser, {
                expiresIn: '1 day'
            })
            return token
        } catch (error) {
            return response.json(error.errors)
        }
    }

    /**
	* @swagger
	* /api/login:
	*   post:
	*     tags:
	*       - Users
    *     summary: Login a User 
	*     requestBody:
	*       required: true         
	*       content:
	*         application/json:
	*           description: User payload
	*           schema: 
    *             type: object
    *             properties:
	*                 email:
	*                   type: string
	*                   example: 'Your email'
	*                   required: true
    *                 password:
    *                   type: string
    *                   example: "Your secret password"
    *                   required: true       
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Success
	*         content:
	*           application/json:
	*             schema:
	*               $ref: '#/components/schemas/User'
    *       400:
    *         description: Bad Request
	*/

    public async login({ auth, request, response }: HttpContextContract) {
        const { email, password } = await request.validate(LoginValidator)
        try {
            const token = await auth.use("api").attempt(email, password, {
                expiresIn: '1 day'
            })
            return token
        } catch (error) {
            return response.json(error.errors)
        }
    }

    public async viewProfile({ auth, response }: HttpContextContract) {
        const user = await auth.authenticate()
        if (user) {
            const profile = await Profile
                .query()
                .where('userId', user.id)
            if (profile) {
                return profile
            }
            return response.status(404).json({ msg: 'You cannot view this profile' })
        }
        return response.status(400).json({ msg: 'Invalid credentials' }) 
    }

    // public async updateProfile({ auth, response }: HttpContextContract) {
    //     const user = await auth.authenticate()
    //     if (user) {
    //         const profile = await Profile
    //             .query()
    //             .where('userId', user.id)
    //         return response.status(404).json({ msg: 'You cannot update this profile' })
    //     }
    // }

    public async githubLogin ({ ally, auth }: HttpContextContract) {
        const github = ally.use('github')
    /**
     * User has explicitly denied the login request
     */
        if (github.accessDenied()) {
        return 'Access was denied'
        }
    
        /**
         * Unable to verify the CSRF state
         */
        if (github.stateMisMatch()) {
        return 'Request expired. Retry again'
        }
    
        /**
         * There was an unknown error during the redirect
         */
        if (github.hasError()) {
        return github.getError()
        }
    
        /**
         * Finally, access the user
         */
        const user = await github.accessToken
        await auth.use('api').attempt
    }
    
}

