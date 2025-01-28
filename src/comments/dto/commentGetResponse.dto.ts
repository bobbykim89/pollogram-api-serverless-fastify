import { z } from 'zod'
import {
  profileResponseSchema,
  postResponseSchema,
  commentResponseSchema,
} from '../../common/dto'

// export const commentResponseSchema = z.object({
//   id: z.number(),
//   text: z.string(),
//   profile_id: z.number(),
//   post_id: z.number(),
//   created_at: z.date(),
// })

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

// model Comment {
//   id Int @id @default(autoincrement())
//   text String
//   profile_id Int
//   post_id Int
//   user_profile Profile @relation(fields: [profile_id], references: [id], onDelete: Cascade)
//   post Post @relation(fields: [post_id], references: [id], onDelete: Cascade)
//   liked_by CommentLike[]
//   created_at DateTime @default(now())

//   @@map("comments")
// }
// model CommentLike {
//   profile_id Int
//   comment_id Int
//   profile Profile @relation(fields: [profile_id], references: [id], onDelete: Cascade)
//   liked_comment Comment @relation(fields: [comment_id], references: [id], onDelete: Cascade)

//   @@id([profile_id, comment_id])
// }
