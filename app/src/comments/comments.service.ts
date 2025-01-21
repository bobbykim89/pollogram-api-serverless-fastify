import type { ServiceResponse } from '../types'
import { PrismaClient, type User, type Comment } from '@prisma/client'

export class CommentService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }
  public listComments = async (
    postId: string
  ): Promise<ServiceResponse<Comment[]>> => {
    try {
      const commentsList = await this.prisma.comment.findMany({
        where: { post_id: parseInt(postId) },
        orderBy: { created_at: 'desc' },
      })
      return {
        statusCode: 200,
        data: commentsList,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public createNewComment = async (
    postId: string,
    text: string,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<Comment>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findFirst({
        where: { user_id: user.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      const newComment = await this.prisma.comment.create({
        data: {
          post_id: parseInt(postId),
          profile_id: currentUserProfile.id,
          text,
        },
      })
      if (!newComment) return { statusCode: 400, error: 'Bad request' }
      return { statusCode: 201, data: newComment }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public deleteComment = async (
    commentId: string,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<{ message: string }>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findFirst({
        where: { user_id: user.id },
      })
      if (!currentUserProfile) return { statusCode: 404, error: 'Not found' }
      await this.prisma.comment.delete({ where: { id: parseInt(commentId) } })
      return {
        statusCode: 202,
        data: { message: 'Successfully deleted comment' },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public likeComment = async (
    commentId: string,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<Comment>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findFirst({
        where: { user_id: user.id },
      })
      const targetComment = await this.prisma.comment.findFirst({
        where: { id: parseInt(commentId) },
      })
      if (!targetComment) return { statusCode: 400, error: 'Bad request' }
      if (targetComment.profile_id !== currentUserProfile?.id)
        return { statusCode: 401, error: 'Unauthorized' }
      await this.prisma.commentLike.create({
        data: {
          comment_id: targetComment.id,
          profile_id: currentUserProfile.id,
        },
      })
      const updatedComment = await this.prisma.comment.findFirst({
        where: { id: targetComment.id },
      })
      return {
        statusCode: 201,
        data: updatedComment!,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public unlikeComment = async (
    commentId: string,
    user: Omit<User, 'password'>
  ): Promise<ServiceResponse<Comment>> => {
    try {
      const currentUserProfile = await this.prisma.profile.findFirst({
        where: { user_id: user.id },
      })
      const targetComment = await this.prisma.comment.findFirst({
        where: { id: parseInt(commentId) },
      })
      if (!targetComment) return { statusCode: 400, error: 'Bad request' }
      if (targetComment.profile_id !== currentUserProfile?.id)
        return { statusCode: 401, error: 'Unauthorized' }
      await this.prisma.commentLike.delete({
        where: {
          profile_id_comment_id: {
            comment_id: targetComment.id,
            profile_id: currentUserProfile.id,
          },
        },
      })
      const updatedComment = await this.prisma.comment.findFirst({
        where: { id: targetComment.id },
      })
      return {
        statusCode: 202,
        data: updatedComment!,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
}
