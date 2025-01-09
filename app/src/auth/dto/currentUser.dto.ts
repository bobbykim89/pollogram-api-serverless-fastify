import { z } from 'zod'

export const currentUserResponseSchema = z.object({
  email: z.string().email(),
  id: z.number(),
  active: z.boolean(),
  role: z.enum(['USER', 'MANAGER', 'ADMIN']),
  created_at: z.date(),
})

export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>
