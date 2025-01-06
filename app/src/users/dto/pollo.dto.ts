import { z } from 'zod'

export const polloSchema = z.object({
  name: z.string(),
  age: z.number(),
})

export type PolloSchemaType = z.infer<typeof polloSchema>
