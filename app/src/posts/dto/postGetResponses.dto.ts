import { z } from 'zod'
import { profileResponseSchema } from '../../profile/dto'

export const postResponseSchema = z.object({
  id: z.number(),
  text: z.string(),
  image_id: z.string(),
  profile_id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
})

export const postListResponseSchema = z.array(postResponseSchema)

export const postLikeObjectSchema = z.object({
  profile_id: z.number(),
  post_id: z.number(),
})

export const postDetailResponseSchema = postResponseSchema.extend({
  userProfile: profileResponseSchema,
  // TODO: add proper typedef for comments comments dto's are established.
  comments: z.array(z.string()),
  liked_by: z.array(postLikeObjectSchema),
})

export type PostResponse = z.infer<typeof postResponseSchema>
export type PostListResponse = z.infer<typeof postListResponseSchema>
export type PostLikeObject = z.infer<typeof postLikeObjectSchema>
export type PostDetailResponse = z.infer<typeof postDetailResponseSchema>

// model Post {
//   id Int @id @default(autoincrement())
//   text String
//   image_id String
//   user_profile Profile @relation(fields: [profile_id], references: [id], onDelete: Cascade)
//   profile_id Int
//   comments Comment[]
//   liked_by PostLike[]
//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt

//   @@map("posts")
// }

// model PostLike {
//   profile_id Int
//   post_id Int
//   profile Profile @relation(fields: [profile_id], references: [id], onDelete: Cascade)
//   liked_post Post @relation(fields: [post_id], references: [id], onDelete: Cascade)

//   @@id([profile_id, post_id])
// }
