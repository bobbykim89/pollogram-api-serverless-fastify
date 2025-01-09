import { z } from 'zod'
import { passwordSchema } from '../../users/dto/passwordSchema'

export const authInputSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: passwordSchema,
})

export type AuthInput = z.infer<typeof authInputSchema>

export const authResponseSchema = z.object({
  access_token: z.string(),
})

export type AuthUserResponse = z.infer<typeof authResponseSchema>
