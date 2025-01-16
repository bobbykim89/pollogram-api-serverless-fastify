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
  public deletePost = async (
    id: string,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<{ message: string }>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findFirst({
        where: { user_id: user.id },
      })
      const targetPost = await this.prisma.post.findFirst({
        where: { id: parseInt(id) },
      })
      if (!targetPost) return { statusCode: 400, error: 'Bad request' }
      if (targetPost.profile_id !== currentUserProfile?.id)
        return { statusCode: 401, error: 'Unauthorized' }
      await this.prisma.post.delete({ where: { id: targetPost.id } })
      await this.useMultipartData.deleteCloudinaryImage(targetPost.image_id)
      return { statusCode: 200, data: { message: 'Delete successful' } }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public likePost = async (
    postId: string,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<Post>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findFirst({
        where: { user_id: user.id },
      })
      const targetPost = await this.prisma.post.findFirst({
        where: { id: parseInt(postId) },
      })
      if (!targetPost) return { statusCode: 400, error: 'Bad request' }
      if (targetPost.profile_id !== currentUserProfile?.id)
        return { statusCode: 401, error: 'Unauthorized' }
      await this.prisma.postLike.create({
        data: { post_id: targetPost.id, profile_id: currentUserProfile.id },
      })
      const updatedPost = await this.prisma.post.findFirst({
        where: { id: targetPost.id },
        include: { comments: true, liked_by: true },
      })
      return {
        statusCode: 201,
        data: updatedPost!,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public unlikePost = async (
    postId: string,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<Post>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findFirst({
        where: { user_id: user.id },
      })
      const targetPost = await this.prisma.post.findFirst({
        where: { id: parseInt(postId) },
      })
      if (!targetPost) return { statusCode: 400, error: 'Bad request' }
      if (targetPost.profile_id !== currentUserProfile?.id)
        return { statusCode: 401, error: 'Unauthorized' }
      await this.prisma.postLike.delete({
        where: {
          profile_id_post_id: {
            post_id: targetPost.id,
            profile_id: currentUserProfile.id,
          },
        },
      })
      const updatedPost = await this.prisma.post.findFirst({
        where: { id: targetPost.id },
        include: { comments: true, liked_by: true },
      })
      return {
        statusCode: 200,
        data: updatedPost!,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
}
