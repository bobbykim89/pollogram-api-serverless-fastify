import { z } from 'zod'

export const profileUsernameUpdateInputSchema = z.object({
  username: z.string(),
})

export type ProfileUsernameUpdateInput = z.infer<
  typeof profileUsernameUpdateInputSchema
>
