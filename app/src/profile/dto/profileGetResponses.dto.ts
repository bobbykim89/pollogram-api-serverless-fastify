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

// model Follow {
//   followed_by_id Int
//   following_id Int
//   followed_by Profile @relation("followed_by", fields: [followed_by_id], references: [id], onDelete: Cascade)
//   following Profile @relation("following", fields: [following_id], references: [id], onDelete: Cascade)

//   @@id([following_id, followed_by_id])
// }

// model Profile {
//   id Int @id @default(autoincrement())
//   username String @unique
//   image_id String?
//   profile_description String?
//   user User @relation(fields: [user_id], references: [id])
//   user_id Int @unique
//   posts Post[]
//   comments Comment[]
//   following Follow[] @relation("following")
//   followed_by Follow[] @relation("followed_by")
//   liked_posts PostLike[]
//   liked_comments CommentLike[]
//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt
//   @@map("profiles")
// }
