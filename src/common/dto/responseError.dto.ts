import { z } from 'zod'

export const responseErrorSchema = z.object({
  message: z.string(),
})

export type ResponseError = z.infer<typeof responseErrorSchema>
