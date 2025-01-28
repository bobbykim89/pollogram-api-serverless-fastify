import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { responseErrorSchema, responseMessageSchema } from '../common/dto'
import { CommentService } from './comments.service'
import { UseAuth, UseRes } from '../util'
import { commentDetailResponseSchema } from './dto'

export class CommentController {
  private commentService: CommentService
  private useAuth: UseAuth
  private useRes: UseRes

  constructor() {
    this.commentService = new CommentService()
    this.useAuth = new UseAuth()
    this.useRes = new UseRes()
  }
  public setRoute = (app: FastifyInstance) => {
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
            200: z.array(commentDetailResponseSchema),
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
            201: responseMessageSchema,
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
            202: responseMessageSchema,
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
            201: responseMessageSchema,
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
            202: responseMessageSchema,
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
