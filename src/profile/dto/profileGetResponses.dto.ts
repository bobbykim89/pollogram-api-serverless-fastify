import { z } from 'zod'
import { postLikeObjectSchema } from '../../posts/dto'
import { commentLikeObjectSchema } from '../../comments/dto'
import { postResponseSchema, profileResponseSchema } from '../../common/dto'

export const profileListResponseSchema = z.array(profileResponseSchema)

export const followObjectSchema = z.object({
  followed_by_id: z.number(),
  following_id: z.number(),
})

export const profileDetailResponseSchema = profileResponseSchema.extend({
  following: z.array(followObjectSchema),
  followed_by: z.array(followObjectSchema),
  posts: z.array(postResponseSchema),
  liked_posts: z.array(postLikeObjectSchema),
  liked_comments: z.array(commentLikeObjectSchema),
})

export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type ProfileListResponse = z.infer<typeof profileListResponseSchema>
export type FollowObject = z.infer<typeof followObjectSchema>
export type ProfileDetailResponse = z.infer<typeof profileDetailResponseSchema>
