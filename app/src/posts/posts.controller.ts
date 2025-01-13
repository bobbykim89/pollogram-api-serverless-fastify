import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { postDetailResponseSchema, postResponseSchema } from './dto'
import { responseErrorSchema, multipartImageInputSchema } from '../common/dto'
import { PostService } from './posts.service'
import { UseAuth, UseRes } from '../util'

export class PostController {
  private postService: PostService
  private useAuth: UseAuth
  private useRes: UseRes

  constructor() {
    this.postService = new PostService()
    this.useAuth = new UseAuth()
    this.useRes = new UseRes()
  }
  public setRoute = async (app: FastifyInstance) => {
    app
      .withTypeProvider<ZodTypeProvider>()
      .route({
        method: 'GET',
        url: '/',
        schema: {
          response: {
            200: postResponseSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (_, res) => {
          const { statusCode, data, error } =
            await this.postService.getPostList()
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'GET',
        url: '/:id',
        schema: {
          params: z.object({ id: z.string() }),
          response: {
            200: postDetailResponseSchema,
            404: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.postService.getPostDetail(req.params.id)
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
  }
}
