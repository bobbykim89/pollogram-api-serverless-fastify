import { z } from 'zod'
import { profileResponseSchema, commentResponseSchema } from '../../common/dto'

export const commentLikeObjectSchema = z.object({
  profile_id: z.number(),
  comment_id: z.number(),
})

export const commentDetailResponseSchema = commentResponseSchema.extend({
  user_profile: profileResponseSchema,
  liked_by: z.array(commentLikeObjectSchema),
})

export type CommentResponse = z.infer<typeof commentResponseSchema>
export type CommentLikeObject = z.infer<typeof commentLikeObjectSchema>
export type CommentDetailResponse = z.infer<typeof commentDetailResponseSchema>
