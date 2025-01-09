import type { ServiceResponse } from '../types'
import { PrismaClient, type Profile } from '@prisma/client'
import { UseAuth } from '../util'

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
}
