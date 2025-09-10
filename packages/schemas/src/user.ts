import { z } from 'zod'

export const User = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof User>

export const CreateUserInput = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().optional(),
})
export type CreateUserInput = z.infer<typeof CreateUserInput>

export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})
export type LoginInput = z.infer<typeof LoginInput>

export const AuthResponse = z.object({
  user: User,
  token: z.string(),
})
export type AuthResponse = z.infer<typeof AuthResponse>