import { z } from 'zod'
import { passwordSchema } from './passwordSchema'

export const pwUpdateInputSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  newPassword: passwordSchema,
})

export type PwUpdateInput = z.infer<typeof pwUpdateInputSchema>

export const pwUpdateResponseSchema = z.object({
  message: z.string(),
})

export type PwUpdateResponse = z.infer<typeof pwUpdateResponseSchema>
