import { z } from 'zod'
import { passwordSchema } from './passwordSchema'

export const signupUserInputSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(5),
  password: passwordSchema,
})

export type SignupUserInput = z.infer<typeof signupUserInputSchema>

export const signupUserResponseSchema = z.object({
  access_token: z.string(),
})

export type SignupUserResponse = z.infer<typeof signupUserResponseSchema>
