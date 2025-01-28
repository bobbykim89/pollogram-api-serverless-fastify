import { FastifyRequest, FastifyReply, errorCodes } from 'fastify'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UseConfig } from './useConfig.util'
import { PrismaClient } from '@prisma/client'

export class UseAuth {
  private config: UseConfig
  private prisma: PrismaClient
  constructor() {
    this.config = new UseConfig()
    this.prisma = new PrismaClient()
  }
  public signToken = (payload: { id: number | string }) => {
    return jwt.sign(payload, this.config.jwtSecret, { expiresIn: '7d' })
  }
  public hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }
  public checkAuth = async (req: FastifyRequest, res: FastifyReply) => {
    try {
      const bearerToken: string = req.headers.authorization || ''
      const token = bearerToken.replace('Bearer ', '')
      const decodedToken: any = jwt.verify(token, this.config.jwtSecret)
      req.user = decodedToken
    } catch (error) {
      res.status(401).send({ error: 'Unauthorized' })
    }
  }
  public checkUserInfo = async (req: FastifyRequest, res: FastifyReply) => {
    // TODO: figure out fn to check for user info.
    try {
      if (!req.user) {
        return
      }
      const currentUser = await this.prisma.user.findUnique({
        where: { id: req.user.id },
        omit: { password: true },
      })
      if (!currentUser) {
        res.status(404).send({ error: 'Not found' })
        return
      }
      req.currentUser = currentUser
    } catch (error) {
      res.status(401).send({ error: 'Unauthorized' })
    }
  }
}
