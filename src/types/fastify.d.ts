import 'fastify'
import { type User } from '@prisma/client'

declare module 'fastify' {
  interface FastifyRequest {
    user?: Record<string, number>
    currentUser?: Omit<User, 'password'>
  }
}
