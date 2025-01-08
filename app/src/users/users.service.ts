import type { FastifyRequest, FastifyReply } from 'fastify'
import {
  polloSchema,
  type PolloSchemaType,
  type SignupUserInput,
  type SignupUserResponse,
  type AuthInput,
} from './dto'
import type { ServiceResponse } from '../types'
import { PrismaClient, type User } from '@prisma/client'
import { UseAuth } from '../util'
import bcrypt from 'bcryptjs'

export class UserService {
  private prisma: PrismaClient
  private useAuth: UseAuth
  constructor() {
    this.prisma = new PrismaClient()
    this.useAuth = new UseAuth()
  }

  public getPollitoPollito = async (req: FastifyRequest, res: FastifyReply) => {
    res.code(200).send({ message: 'Pollito pollito' })
  }

  public getPolloId = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ) => {
    const { id } = req.params
    res.code(200).send({
      message: `id is ${id}`,
    })
  }
  public postPollitoInfo = async (
    req: FastifyRequest<{ Params: { id: string }; Body: PolloSchemaType }>,
    res: FastifyReply
  ) => {
    const { id } = req.params
    const { name, age } = polloSchema.parse(req.body)
    res.send({
      message: `Name is ${name} and ${age} years old`,
      id,
    })
  }
  public getRandomPollos = async (dto: SignupUserInput, id: string) => {
    const { email, password, username } = dto
    if (username === 'manguito') {
      throw new Error('pollito!')
    }
    return {
      email,
      password,
      username,
      param_id: id,
    }
  }
  public getAllUsersList = async (req: FastifyRequest, res: FastifyReply) => {
    const users = await this.prisma.user.findMany({
      include: {
        profile: true,
      },
    })
    res.code(200).send({ users })
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
      if (!user) {
        return {
          statusCode: 404,
          error: 'Not found',
        }
      }
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
      if (user || profile) {
        return {
          statusCode: 400,
          error: 'Email or username is already used',
        }
      }
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
  public loginUser = async (
    dto: AuthInput
  ): Promise<ServiceResponse<SignupUserResponse>> => {
    try {
      const { email, password } = dto
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (!user) {
        return {
          statusCode: 403,
          error: 'Validation error',
        }
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return {
          statusCode: 403,
          error: 'Validation error',
        }
      }
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
  public createToken = () => {
    const str = 'pio pio'
    const payload = {
      id: str,
    }
    const token = this.useAuth.signToken(payload)
    return {
      access_token: `Bearer ${token}`,
    }
  }
  public decodeToken = (req: FastifyRequest) => {
    const usr = req.user
    return { ...usr }
  }
}
