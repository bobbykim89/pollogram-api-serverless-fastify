import { z } from 'zod'

export const postResponseSchema = z.object({
  id: z.number(),
  text: z.string(),
  image_id: z.string(),
  profile_id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
})

export type PostResponse = z.infer<typeof postResponseSchema>

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
