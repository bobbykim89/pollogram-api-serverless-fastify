import { z } from 'zod'
import {
  profileResponseSchema,
  commentResponseSchema,
  postResponseSchema,
} from '../../common/dto'

export const postListResponseSchema = z.array(postResponseSchema)

export const postLikeObjectSchema = z.object({
  profile_id: z.number(),
  post_id: z.number(),
})
export const postDetailResponseSchema = postResponseSchema.extend({
  user_profile: profileResponseSchema,
  comments: z.array(commentResponseSchema),
  liked_by: z.array(postLikeObjectSchema),
})

export type PostResponse = z.infer<typeof postResponseSchema>
export type PostListResponse = z.infer<typeof postListResponseSchema>
export type PostLikeObject = z.infer<typeof postLikeObjectSchema>
export type PostDetailResponse = z.infer<typeof postDetailResponseSchema>
