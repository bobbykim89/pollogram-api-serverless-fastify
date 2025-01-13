import type { ServiceResponse } from '../types'
import { PrismaClient, type Post, type User } from '@prisma/client'
import type {} from './dto'
import { type MultipartImageInput, type MultipartInput } from '../common/dto'
import { UseMultipartData } from '../util'

export class PostService {
  private prisma: PrismaClient
  private useMultipartData: UseMultipartData

  constructor() {
    this.prisma = new PrismaClient()
    this.useMultipartData = new UseMultipartData()
  }

  public getPostList = async (): Promise<ServiceResponse<Post[]>> => {
    try {
      const postList = await this.prisma.post.findMany({
        orderBy: { created_at: 'desc' },
      })
      return {
        statusCode: 200,
        data: postList,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public getPostDetail = async (id: string): Promise<ServiceResponse<Post>> => {
    try {
      const currentPost = await this.prisma.post.findFirst({
        where: { id: parseInt(id) },
        include: { comments: true, liked_by: true },
      })
      if (!currentPost) return { statusCode: 404, error: 'Not found' }
      return { statusCode: 200, data: currentPost }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public createNewPost = async (
    dto: MultipartInput,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<Post>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findUnique({
        where: { user_id: user.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      const { statusCode, data, error } =
        await this.useMultipartData.uploadCloudinary(dto.image, 'posts')
      if (error) return { statusCode, error }
      const {
        statusCode: contentStatusCode,
        data: contentData,
        error: contentError,
      } = await this.useMultipartData.readFormDataText(dto.content)
      if (contentError)
        return { statusCode: contentStatusCode, error: contentError }
      const newPost = await this.prisma.post.create({
        data: {
          image_id: data?.image_id!,
          text: contentData!,
          profile_id: currentUserProfile.id,
        },
      })
      if (!newPost) return { statusCode: 400, error: 'Bad request' }
      return {
        statusCode: 203,
        data: newPost,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
}
