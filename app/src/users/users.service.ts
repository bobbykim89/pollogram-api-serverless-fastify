import type { FastifyRequest, FastifyReply } from 'fastify'
import {
  polloSchema,
  type PolloSchemaType,
  signupUserInputSchema,
  type SignupUserInput,
  type SignupUserResponse,
} from './dto'
import type { ServiceResponse } from '../types'
import { PrismaClient } from '@prisma/client'
import { UseAuth } from '../util'

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
  public signupUser = async (
    dto: SignupUserInput
  ): Promise<ServiceResponse<SignupUserResponse>> => {
    try {
      const { email, username, password } = dto
      let user = await this.prisma.user.findFirst({
        where: {
          email,
        },
      })
      let profile = await this.prisma.profile.findFirst({
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
