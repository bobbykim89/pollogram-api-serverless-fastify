import type { ServiceResponse } from '../types'
import { PrismaClient, type Profile } from '@prisma/client'
import type { ProfileUsernameUpdateInput } from './dto'

export class ProfileService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }
  public getProfileList = async (): Promise<ServiceResponse<Profile[]>> => {
    try {
      const profileList = await this.prisma.profile.findMany()
      return {
        statusCode: 200,
        data: profileList,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public getCurrentUserProfile = async (
    payload: Record<string, number>
  ): Promise<ServiceResponse<Profile>> => {
    try {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: payload.id },
      })
      if (!currentUser) {
        return {
          statusCode: 404,
          error: 'Not found',
        }
      }
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: currentUser.id },
        include: {
          posts: true,
          followed_by: true,
          following: true,
          liked_posts: true,
          liked_comments: true,
        },
      })
      if (!currentUserProfile) {
        return {
          statusCode: 404,
          error: 'Not found',
        }
      }
      return {
        statusCode: 200,
        data: currentUserProfile,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public getProfileById = async (
    id: string
  ): Promise<ServiceResponse<Profile>> => {
    try {
      const userProfile = await this.prisma.profile.findFirst({
        where: { id: parseInt(id) },
        include: {
          posts: true,
          followed_by: true,
          following: true,
          liked_posts: true,
          liked_comments: true,
        },
      })
      if (!userProfile) {
        return {
          statusCode: 404,
          error: 'Not found',
        }
      }
      return {
        statusCode: 200,
        data: userProfile,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public updateUsername = async (
    body: ProfileUsernameUpdateInput,
    user: Record<string, number>
  ): Promise<ServiceResponse<Profile>> => {
    try {
      const { username } = body
      const currentUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        omit: { password: true },
      })
      if (!currentUser) return { statusCode: 404, error: 'Not found' }
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: currentUser.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      const updatedProfile = await this.prisma.profile.update({
        where: { id: currentUserProfile.id },
        data: { username },
        include: {
          posts: true,
          followed_by: true,
          following: true,
          liked_posts: true,
          liked_comments: true,
        },
      })
      return { statusCode: 204, data: updatedProfile }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public updateProfileImage = async () => {}
  public followUser = async (
    payload: Record<string, number>,
    id: string
  ): Promise<ServiceResponse<Profile>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: payload.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      const targetUserProfile = await this.prisma.profile.findFirst({
        where: { id: parseInt(id) },
      })
      if (!targetUserProfile) return { statusCode: 404, error: 'Not found' }
      await this.prisma.follow.create({
        data: {
          followed_by_id: currentUserProfile.id,
          following_id: targetUserProfile.id,
        },
      })
      const updatedProfile = await this.prisma.profile.findUnique({
        where: { user_id: payload.id },
        include: {
          posts: true,
          followed_by: true,
          following: true,
          liked_posts: true,
          liked_comments: true,
        },
      })
      if (!updatedProfile) return { statusCode: 400, error: 'Bad request' }

      return {
        statusCode: 201,
        data: updatedProfile,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public unfollowUser = async (
    payload: Record<string, number>,
    id: string
  ): Promise<ServiceResponse<Profile>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: payload.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      const targetUserProfile = await this.prisma.profile.findFirst({
        where: { id: parseInt(id) },
      })
      if (!targetUserProfile) return { statusCode: 404, error: 'Not found' }
      await this.prisma.follow.delete({
        where: {
          following_id_followed_by_id: {
            followed_by_id: currentUserProfile.id,
            following_id: targetUserProfile.id,
          },
        },
      })
      const updatedProfile = await this.prisma.profile.findUnique({
        where: { user_id: payload.id },
        include: {
          posts: true,
          followed_by: true,
          following: true,
          liked_posts: true,
          liked_comments: true,
        },
      })
      if (!updatedProfile) return { statusCode: 400, error: 'Bad request' }
      return {
        statusCode: 200,
        data: updatedProfile,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
}
