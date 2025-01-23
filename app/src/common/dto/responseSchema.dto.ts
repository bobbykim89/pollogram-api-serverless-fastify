import { z } from 'zod'

const baseResponseSchema = z.object({
  id: z.number(),
  created_at: z.date(),
})

export const userResponseSchema = baseResponseSchema.extend({
  email: z.string().email(),
  active: z.boolean(),
  role: z.enum(['USER', 'MANAGER', 'ADMIN']),
})

export const profileResponseSchema = baseResponseSchema.extend({
  username: z.string(),
  image_id: z.union([z.string(), z.null()]),
  profile_description: z.union([z.string(), z.null()]),
  user_id: z.number(),
  updated_at: z.date(),
})

export const postResponseSchema = baseResponseSchema.extend({
  text: z.string(),
  image_id: z.string(),
  profile_id: z.number(),
  updated_at: z.date(),
})

export const commentResponseSchema = baseResponseSchema.extend({
  text: z.string(),
  profile_id: z.number(),
  post_id: z.number(),
})
