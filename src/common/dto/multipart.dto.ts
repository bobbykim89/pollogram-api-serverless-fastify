import { z } from 'zod'

const multipartBaseSchema = z.object({
  type: z.string(),
  fieldname: z.string(),
  mimetype: z.string(),
})

export const multipartImageInputSchema = multipartBaseSchema.extend({
  filename: z.string(),
  _buf: z.instanceof(Buffer),
})

export const multipartContentInputSchema = multipartBaseSchema.extend({
  value: z.string(),
})

export const multipartInputSchema = z.object({
  image: multipartImageInputSchema,
  content: multipartContentInputSchema,
})

export type MultipartImageInput = z.infer<typeof multipartImageInputSchema>
export type MultipartContentInput = z.infer<typeof multipartContentInputSchema>
export type MultipartInput = z.infer<typeof multipartInputSchema>
