import { z } from 'zod'

export const profileResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  image_id: z.union([z.string(), z.null()]),
  profile_description: z.union([z.string(), z.null()]),
  user_id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
})

export const profileListResponseSchema = z.array(profileResponseSchema)

export const followObjectSchema = z.object({
  followed_by_id: z.number(),
  following_id: z.number(),
  followed_by_profile: profileResponseSchema,
  following_profile: profileResponseSchema,
})

export const profileDetailResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  image_id: z.union([z.string(), z.null()]),
  profile_description: z.union([z.string(), z.null()]),
  user_id: z.number(),
  // TODO: update format
  following: z.array(followObjectSchema),
  followed_by: z.array(followObjectSchema),
  posts: z.array(z.string()),
  liked_posts: z.array(z.string()),
  liked_comments: z.array(z.string()),
  created_at: z.date(),
  updated_at: z.date(),
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
