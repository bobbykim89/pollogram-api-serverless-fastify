import { z } from 'zod'

export const profileDescriptionUpdateInputSchema = z.object({
  description: z.string(),
})

export type ProfileDescriptionUpdateInput = z.infer<
  typeof profileDescriptionUpdateInputSchema
>
