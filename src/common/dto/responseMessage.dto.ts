import { z } from 'zod'

export const responseMessageSchema = z.object({
  message: z.string(),
})

export type ResponseMessage = z.infer<typeof responseMessageSchema>
