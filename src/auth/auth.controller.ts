import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { authInputSchema, authResponseSchema } from './dto'
import { responseErrorSchema, userResponseSchema } from '../common/dto'
import { AuthService } from './auth.service'
import { UseAuth, UseRes } from '../util'

export class AuthController {
  private authService: AuthService
  private useAuth: UseAuth
  private useRes: UseRes

  constructor() {
    this.authService = new AuthService()
    this.useAuth = new UseAuth()
    this.useRes = new UseRes()
  }
  public setRoute = (app: FastifyInstance) => {
    app
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: 'GET',
        url: '/',
        schema: {
          tags: ['Auth'],
          response: {
            200: userResponseSchema,
            404: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.authService.getCurrentUser(req.user!)
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'POST',
        url: '/login',
        schema: {
          tags: ['Auth'],
          body: authInputSchema,
          response: {
            201: authResponseSchema,
            403: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        handler: async (req, res) => {
          const { statusCode, data, error } = await this.authService.loginUser(
            req.body
          )
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
  }
}
