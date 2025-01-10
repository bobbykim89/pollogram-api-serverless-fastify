import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UseConfig } from './useConfig.util'

export class UseAuth {
  private config: UseConfig

  constructor() {
    this.config = new UseConfig()
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
}
