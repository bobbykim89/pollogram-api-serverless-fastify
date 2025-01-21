import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { commentResponseSchema } from './dto'
import {
  responseErrorSchema,
  multipartImageInputSchema,
  requestAuthHeaderSchema,
  multipartInputSchema,
} from '../common/dto'
// import { PostService } from './posts.service'
import { CommentService } from './comments.service'
import { UseAuth, UseRes } from '../util'

export class CommentController {
  private commentService: CommentService
  private useAuth: UseAuth
  private useRes: UseRes

  constructor() {
    this.commentService = new CommentService()
    this.useAuth = new UseAuth()
    this.useRes = new UseRes()
  }
  public setRoute = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().route({
      method: 'GET',
      url: '/:postId',
      schema: {
        tags: ['Comments'],
        params: z.object({
          postId: z.string(),
        }),
        response: {
          200: z.array(commentResponseSchema),
          500: responseErrorSchema,
        },
      },
      onRequest: app.auth([this.useAuth.checkAuth, this.useAuth.checkUserInfo]),
      handler: async (req, res) => {
        const { statusCode, data, error } =
          await this.commentService.listComments(req.params.postId)

        this.useRes.sendDataOrError<typeof data>(res, {
          statusCode,
          data,
          error,
        })
      },
    })
  }
}
