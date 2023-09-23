/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world again' }
})

// Route.get('/projects', async () => {
//   const products =  [
//       { id: 1, name: 'product 1' },
//       { id: 2, name: 'product 2' },
//       { id: 3, name: 'product 3' },
//       { id: 4, name: 'product 4' },
//     ]
//   return await products
// })

Route.get('/github/redirect', async ({ ally }) => {
  return ally.use('github').redirect()
})

Route.get('/github/callback', 'UsersController.githubLogin')

Route.group(() => {
  Route.post("register", "UsersController.register")
  Route.post("login", "UsersController.login")

  Route.group(() => {
    Route.get("profile", "UsersController.viewProfile")
    Route.group(() => {
      Route.get("", "ProjectsController.index")
      Route.post("", "ProjectsController.create")
      Route.get(":id", "ProjectsController.show")
      Route.patch(":id", "ProjectsController.update")
      Route.delete(":id", "ProjectsController.delete")
    }).prefix("projects")
    Route.group(() => {
      Route.get("", "TechnologiesController.index")
      Route.post("", "TechnologiesController.create")
    }).prefix("technologies")
  }).middleware("auth:api")

}).prefix("api")

