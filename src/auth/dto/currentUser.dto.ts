import { z } from 'zod'
import { userResponseSchema } from '../../common/dto'

export type CurrentUserResponse = z.infer<typeof userResponseSchema>
