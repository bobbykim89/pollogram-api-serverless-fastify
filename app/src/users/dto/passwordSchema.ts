import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .refine((pw) => /[A-Z]/.test(pw), {
    message: 'Password must have at least 1 uppercase character',
  })
  .refine((pw) => /[a-z]/.test(pw), {
    message: 'Password must have at least 1 lowercase character',
  })
  .refine((pw) => /[0-9]/.test(pw), {
    message: 'Password must have at least 1 number',
  })
  .refine((pw) => /[!@#$%^&*]/.test(pw), {
    message: 'Password must have at least 1 special character',
  })
