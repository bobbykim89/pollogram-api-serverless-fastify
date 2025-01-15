import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { postDetailResponseSchema, postResponseSchema } from './dto'
import {
  responseErrorSchema,
  multipartImageInputSchema,
  requestAuthHeaderSchema,
  multipartInputSchema,
} from '../common/dto'
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
          tags: ['Posts'],
          headers: requestAuthHeaderSchema,
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
        method: 'POST',
        url: '/',
        schema: {
          tags: ['Posts'],
          headers: requestAuthHeaderSchema,
          body: multipartInputSchema,
          response: {
            203: postResponseSchema,
            400: responseErrorSchema,
            404: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        onRequest: app.auth(
          [this.useAuth.checkAuth, this.useAuth.checkUserInfo],
          { relation: 'and' }
        ),
        // preHandler: app.auth(
        //   [this.useAuth.checkAuth, this.useAuth.checkUserInfo],
        //   { relation: 'and' }
        // ),
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.postService.createNewPost(req.body, req.currentUser!)
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
          tags: ['Posts'],
          headers: requestAuthHeaderSchema,
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
      .route({
        method: 'DELETE',
        url: '/:id',
        schema: {
          tags: ['Posts'],
          headers: requestAuthHeaderSchema,
          params: z.object({ id: z.string() }),
          response: {
            200: z.object({ message: z.string() }),
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
          const { statusCode, data, error } = await this.postService.deletePost(
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
