import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  signupUserInputSchema,
  signupUserResponseSchema,
  pwUpdateInputSchema,
  pwUpdateResponseSchema,
} from './dto'
import { responseErrorSchema } from '../common/dto'
import { UserService } from './users.service'
import { UseAuth, UseRes } from '../util'

export class UserController {
  private userService: UserService
  private useAuth: UseAuth
  private useRes: UseRes
  constructor() {
    this.userService = new UserService()
    this.useAuth = new UseAuth()
    this.useRes = new UseRes()
  }
  public setRoute = (app: FastifyInstance) => {
    app
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: 'POST',
        url: '/signup',
        schema: {
          tags: ['Users'],
          body: signupUserInputSchema,
          response: {
            201: signupUserResponseSchema,
            400: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        handler: async (req, res) => {
          // validate body
          const { statusCode, data, error } = await this.userService.signupUser(
            req.body
          )
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'PUT',
        url: '/change-password',
        schema: {
          tags: ['Users'],
          body: pwUpdateInputSchema,
          response: {
            204: pwUpdateResponseSchema,
            404: responseErrorSchema,
            403: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.userService.updatePassword(req.body, req.user!)
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
  }
}
