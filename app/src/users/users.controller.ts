import type {
  FastifyInstance,
  FastifyPluginAsync,
  RouteOptions,
  FastifyRequest,
  FastifyReply,
  RouteGenericInterface,
} from 'fastify'
import { polloSchema, PolloSchemaType } from './dto'
import { UserService } from './users.service'

// export const userController: FastifyPluginAsync = async (
//   api: FastifyInstance
// ) => {
//   api.route({
//     method: 'GET',
//     url: '/',
//     handler: async (req, res) => {
//       return res.code(200).send({ message: 'Pollito pollito' })
//     },
//   })
//   api.route<{ Params: { id: string } }>({
//     method: 'GET',
//     url: '/:id',
//     handler: async (req, res) => {
//       const { id } = req.params
//       res.code(200).send({
//         message: `id is ${id}`,
//       })
//     },
//   })
//   api.route<{ Params: { id: string }; Body: PolloSchemaType }>({
//     method: 'POST',
//     url: '/:id',
//     handler: async (req, res) => {
//       const { id } = req.params
//       //   const { name, age } = req.body
//       const { name, age } = polloSchema.parse(req.body)
//       res.send({
//         message: `Name is ${name} and ${age} years old`,
//         id,
//       })
//     },
//   })
// }

export class UserController {
  private userService: UserService
  constructor() {
    this.userService = new UserService()
  }
  public setUserRoute = async (app: FastifyInstance) => {
    app
      .route({
        method: 'GET',
        url: '/',
        handler: (req, res) => this.userService.getPollitoPollito(req, res),
      })
      .route<{ Params: { id: string } }>({
        method: 'GET',
        url: '/:id',
        handler: (req, res) => this.userService.getPolloId(req, res),
      })
      .route<{ Params: { id: string }; Body: PolloSchemaType }>({
        method: 'POST',
        url: '/:id',
        handler: (req, res) => this.userService.postPollitoInfo(req, res),
      })
  }
}
