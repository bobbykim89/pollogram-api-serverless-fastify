import type { ServiceResponse } from '../types'
import { PrismaClient, type Profile, type User } from '@prisma/client'
import type {
  ProfileUsernameUpdateInput,
  ProfileDescriptionUpdateInput,
} from './dto'
import { type MultipartImageInput, type ResponseMessage } from '../common/dto'
import { UseMultipartData } from '../util'

export class ProfileService {
  private prisma: PrismaClient
  private useMultipartData: UseMultipartData

  constructor() {
    this.prisma = new PrismaClient()
    this.useMultipartData = new UseMultipartData()
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
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<Profile>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: user.id },
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
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<ResponseMessage>> => {
    try {
      const { username } = body
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: user.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      await this.prisma.profile.update({
        where: { id: currentUserProfile.id },
        data: { username },
      })
      return {
        statusCode: 204,
        data: { message: 'Successfully updated profile.' },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public updateProfileDescription = async (
    dto: ProfileDescriptionUpdateInput,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<ResponseMessage>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: user.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      await this.prisma.profile.update({
        where: { id: currentUserProfile.id },
        data: { profile_description: dto.description },
      })
      return {
        statusCode: 204,
        data: { message: 'Successfully updated profile.' },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public updateProfileImage = async (
    dto: MultipartImageInput,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<ResponseMessage>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: user.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      const cloudinaryRes = await this.useMultipartData.uploadCloudinary(
        dto,
        'profile'
      )
      if (cloudinaryRes.error)
        return {
          statusCode: cloudinaryRes.statusCode,
          error: cloudinaryRes.error,
        }
      const { image_id } = cloudinaryRes.data!
      await this.prisma.profile.update({
        where: { id: currentUserProfile.id },
        data: { image_id },
      })
      return {
        statusCode: 204,
        data: { message: 'Successfully updated profile.' },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public followUser = async (
    user: Omit<User, 'password'>,
    id: string
  ): Promise<ServiceResponse<ResponseMessage>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: user.id },
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

      return {
        statusCode: 201,
        data: { message: 'Successfully followed user.' },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public unfollowUser = async (
    user: Omit<User, 'password'>,
    id: string
  ): Promise<ServiceResponse<ResponseMessage>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: user.id },
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
      return {
        statusCode: 204,
        data: { message: 'Successfully unfollowed user.' },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
}
