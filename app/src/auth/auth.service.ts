import { PrismaClient, type User } from '@prisma/client'
import type { ServiceResponse } from '../types'
import { UseAuth } from '../util'
import { type AuthInput, type AuthUserResponse } from './dto'
import bcrypt from 'bcryptjs'

export class AuthService {
  private prisma: PrismaClient
  private useAuth: UseAuth

  constructor() {
    this.prisma = new PrismaClient()
    this.useAuth = new UseAuth()
  }

  public getCurrentUser = async (
    payload: Record<string, number>
  ): Promise<ServiceResponse<Omit<User, 'password'>>> => {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.id,
        },
        omit: {
          password: true,
        },
      })
      if (!user) return { statusCode: 404, error: 'Not found' }
      return {
        statusCode: 200,
        data: user,
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
  public loginUser = async (
    dto: AuthInput
  ): Promise<ServiceResponse<AuthUserResponse>> => {
    try {
      const { email, password } = dto
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (!user) return { statusCode: 403, error: 'Validation error' }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return { statusCode: 403, error: 'Validation error' }
      const accessToken = this.useAuth.signToken({ id: user.id })
      return {
        statusCode: 201,
        data: {
          access_token: `Bearer ${accessToken}`,
        },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
}
