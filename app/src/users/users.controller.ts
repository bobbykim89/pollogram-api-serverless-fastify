import type {
  FastifyInstance,
  FastifyPluginAsync,
  RouteOptions,
  FastifyRequest,
  FastifyReply,
  RouteGenericInterface,
} from 'fastify'
import {
  polloSchema,
  PolloSchemaType,
  type SignupUserInput,
  signupUserInputSchema,
} from './dto'
import { UserService } from './users.service'
import { UseAuth } from '../util'

export class UserController {
  private userService: UserService
  private useAuth: UseAuth
  constructor() {
    this.userService = new UserService()
    this.useAuth = new UseAuth()
  }
  public setUserRoute = async (app: FastifyInstance) => {
    app
      .route({
        method: 'GET',
        url: '/',
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          if (!req.user) {
            res.code(401).send({ message: 'Unauthorized' })
            return
          }
          const { statusCode, data, error } =
            await this.userService.getCurrentUser(req.user)
          if (error) {
            res.code(statusCode).send({
              message: error,
            })
            return
          }
          res.code(statusCode).send(data)
        },
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
      .route({
        method: 'GET',
        url: '/list',
        handler: async (req, res) =>
          await this.userService.getAllUsersList(req, res),
      })
      .route<{ Params: { id: string }; Body: SignupUserInput }>({
        method: 'POST',
        url: '/random/:id',
        preHandler: [],
        handler: (req, res) => {
          const body = signupUserInputSchema.parse(req.body)
          const param = req.params.id
          return this.userService.getRandomPollos(body, param)
        },
      })
      .route({
        method: 'POST',
        url: '/create-token',
        handler: () => this.userService.createToken(),
      })
      .route({
        method: 'GET',
        url: '/check-token',
        preHandler: [this.useAuth.checkAuth],
        handler: this.userService.decodeToken,
      })
      .route<{ Body: SignupUserInput }>({
        method: 'POST',
        url: '/signup',
        handler: async (req, res) => {
          // validate body
          const dto = signupUserInputSchema.parse(req.body)
          const { statusCode, data, error } = await this.userService.signupUser(
            dto
          )
          if (error) {
            res.code(statusCode).send({
              message: error,
            })
            return
          }
          res.code(statusCode).send(data)
        },
      })
  }
}
