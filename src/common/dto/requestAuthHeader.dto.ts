import { z } from 'zod'

export const requestAuthHeaderSchema = z.object({
  authorization: z.optional(z.string()),
})

export type RequestAuthHeader = z.infer<typeof requestAuthHeaderSchema>
