import type { ServiceResponse } from '../types'
import { PrismaClient, type Post } from '@prisma/client'
import type {} from './dto'
import { type MultipartImageInput } from '../common/dto'
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
}
