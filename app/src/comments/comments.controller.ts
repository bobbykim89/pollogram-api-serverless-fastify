import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { commentResponseSchema } from './dto'
import { responseErrorSchema } from '../common/dto'
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
    app
      .withTypeProvider<ZodTypeProvider>()
      .route({
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
        onRequest: app.auth([
          this.useAuth.checkAuth,
          this.useAuth.checkUserInfo,
        ]),
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
      .route({
        method: 'POST',
        url: '/:postId',
        schema: {
          tags: ['Comments'],
          params: z.object({
            postId: z.string(),
          }),
          body: z.object({
            text: z.string(),
          }),
          response: {
            201: commentResponseSchema,
            400: responseErrorSchema,
            404: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        onRequest: app.auth([
          this.useAuth.checkAuth,
          this.useAuth.checkUserInfo,
        ]),
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.commentService.createNewComment(
              req.params.postId,
              req.body.text,
              req.currentUser!
            )
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'DELETE',
        url: '/:id',
        schema: {
          tags: ['Comments'],
          params: z.object({
            id: z.string(),
          }),
          response: {
            202: z.object({ message: z.string() }),
            404: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        onRequest: app.auth([
          this.useAuth.checkAuth,
          this.useAuth.checkUserInfo,
        ]),
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.commentService.deleteComment(
              req.params.id,
              req.currentUser!
            )
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'POST',
        url: '/:id/like',
        schema: {
          tags: ['Comments'],
          params: z.object({
            id: z.string(),
          }),
          response: {
            201: commentResponseSchema,
            400: responseErrorSchema,
            401: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        onRequest: app.auth([
          this.useAuth.checkAuth,
          this.useAuth.checkUserInfo,
        ]),
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.commentService.likeComment(
              req.params.id,
              req.currentUser!
            )
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'DELETE',
        url: '/:id/unlike',
        schema: {
          tags: ['Comments'],
          params: z.object({
            id: z.string(),
          }),
          response: {
            202: commentResponseSchema,
            400: responseErrorSchema,
            401: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        onRequest: app.auth([
          this.useAuth.checkAuth,
          this.useAuth.checkUserInfo,
        ]),
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.commentService.unlikeComment(
              req.params.id,
              req.currentUser!
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
