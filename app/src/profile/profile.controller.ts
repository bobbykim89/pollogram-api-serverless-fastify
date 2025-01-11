import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import {
  profileListResponseSchema,
  profileDetailResponseSchema,
  profileUsernameUpdateInputSchema,
} from './dto'
import { responseErrorSchema, multipartImageInputSchema } from '../common/dto'
import { ProfileService } from './profile.service'
import { UseAuth, UseRes } from '../util'

export class ProfileController {
  private profileService: ProfileService
  private useAuth: UseAuth
  private useRes: UseRes

  constructor() {
    this.profileService = new ProfileService()
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
            200: profileListResponseSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (_, res) => {
          const { statusCode, data, error } =
            await this.profileService.getProfileList()

          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'GET',
        url: '/current-user',
        schema: {
          response: {
            200: profileDetailResponseSchema,
            404: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.profileService.getCurrentUserProfile(req.user!)
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'PUT',
        url: '/current-user/username',
        schema: {
          body: profileUsernameUpdateInputSchema,
          response: {
            204: profileDetailResponseSchema,
            404: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.profileService.updateUsername(req.body, req.user!)
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'PUT',
        url: '/current-user/profile-image',
        schema: {
          body: z.object({
            image: multipartImageInputSchema,
          }),
          200: profileDetailResponseSchema,
          400: responseErrorSchema,
          404: responseErrorSchema,
          500: responseErrorSchema,
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.profileService.updateProfileImage(
              req.body.image,
              req.user!
            )
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
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: profileDetailResponseSchema,
            404: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.profileService.getProfileById(req.params.id)
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'GET',
        url: '/:id/follow',
        schema: {
          params: z.object({
            id: z.string(),
          }),
          response: {
            201: profileDetailResponseSchema,
            404: responseErrorSchema,
            400: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.profileService.followUser(req.user!, req.params.id)
          this.useRes.sendDataOrError<typeof data>(res, {
            statusCode,
            data,
            error,
          })
        },
      })
      .route({
        method: 'DELETE',
        url: '/:id/unfollow',
        schema: {
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: profileDetailResponseSchema,
            404: responseErrorSchema,
            400: responseErrorSchema,
            500: responseErrorSchema,
          },
        },
        preHandler: [this.useAuth.checkAuth],
        handler: async (req, res) => {
          const { statusCode, data, error } =
            await this.profileService.unfollowUser(req.user!, req.params.id)
          this.useRes.sendDataOrError(res, { statusCode, data, error })
        },
      })
  }
}
