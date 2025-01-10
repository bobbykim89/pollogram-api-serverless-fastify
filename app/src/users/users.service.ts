import type {
  SignupUserInput,
  SignupUserResponse,
  PwUpdateInput,
  PwUpdateResponse,
} from './dto'
import type { ServiceResponse } from '../types'
import { PrismaClient } from '@prisma/client'
import { UseAuth } from '../util'
import bcrypt from 'bcryptjs'

export class UserService {
  private prisma: PrismaClient
  private useAuth: UseAuth
  constructor() {
    this.prisma = new PrismaClient()
    this.useAuth = new UseAuth()
  }

  public signupUser = async (
    dto: SignupUserInput
  ): Promise<ServiceResponse<SignupUserResponse>> => {
    try {
      const { email, username, password } = dto
      let user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      })
      let profile = await this.prisma.profile.findUnique({
        where: {
          username,
        },
      })
      if (user || profile)
        return { statusCode: 400, error: 'Email or username is already used' }
      const hashedPassword = await this.useAuth.hashPassword(password)
      user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })
      profile = await this.prisma.profile.create({
        data: {
          username,
          user_id: user.id,
        },
      })
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
  public updatePassword = async (
    dto: PwUpdateInput,
    payload: Record<string, number>
  ): Promise<ServiceResponse<PwUpdateResponse>> => {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      })
      const { currentPassword, newPassword } = dto
      if (!user) return { statusCode: 404, error: 'Not found' }
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) return { statusCode: 403, error: 'Validation error' }
      const hashedNewPw = await this.useAuth.hashPassword(newPassword)
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedNewPw },
      })
      return {
        statusCode: 204,
        data: { message: 'Updated password successfully.' },
      }
    } catch (error) {
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      }
    }
  }
}
