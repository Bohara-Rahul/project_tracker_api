import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class SocialAuthsController {

    public async redirectToGoogle({ ally }: HttpContextContract) {
        return ally.use('google').redirect()
    }

    public async googleCallback({ ally, auth }: HttpContextContract) {
        const google= ally.use('google')
        
        if (google.accessDenied()) {
            return 'Access was denied'
        }

        if (google.stateMisMatch()) {
            return 'Request expired. Try again'
        }

        if (google.hasError()) {
            return google.getError()
        }

        const googleUser = await google.user()

        const user = await User.firstOrCreate({
            email: googleUser.email!
        }, {
            name: googleUser.name,
            accessToken: googleUser.token.token,
            isVerified: googleUser.emailVerificationState === 'verified'
        })

        await auth.use('api').login(user)
    }
 
    public async redirectToGithub({ ally }: HttpContextContract) {
        return ally.use('github').redirect()
    }
 
    public async githubCallback({ ally, auth }: HttpContextContract) {
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

        const githubUser = await github.user()

        /**
         * Find the user by email or create
         * a new one
        */
        const user = await User.firstOrCreate({
         email: githubUser.email!
         }, {
         name: githubUser.name,
         accessToken: githubUser.token.token,
         isVerified: githubUser.emailVerificationState === 'verified'
        })
        

        /**
        * Login user using the api guard
        */
        await auth.use('api').login(user)
    }
}
