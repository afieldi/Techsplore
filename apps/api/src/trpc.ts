import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import { FeedItem, CreateUserInput, LoginInput, AuthResponse } from '@techsplore/schemas'
import { FeedRepo, UserRepo } from '@techsplore/db'
import { generateToken, verifyToken, extractTokenFromHeader } from './auth'
import type { FastifyRequest, FastifyReply } from 'fastify'

export const createContext = async ({ req, res }: { req: FastifyRequest; res: FastifyReply }) => {
  const token = extractTokenFromHeader(req.headers.authorization as string)
  let user = null
  
  if (token) {
    const decoded = verifyToken(token)
    if (decoded) {
      user = await UserRepo.findById(decoded.userId)
    }
  }
  
  return { user }
}

const t = initTRPC.context<typeof createContext>().create()

// Auth middleware
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

const protectedProcedure = t.procedure.use(isAuthed)

export const appRouter = t.router({
  // Authentication routes
  register: t.procedure
    .input(CreateUserInput)
    .output(AuthResponse)
    .mutation(async ({ input }) => {
      try {
        // Check if user already exists
        const existingUser = await UserRepo.findByEmail(input.email)
        if (existingUser) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
          })
        }

        const user = await UserRepo.create(input)
        const token = generateToken(user)

        return { user, token }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        })
      }
    }),

  login: t.procedure
    .input(LoginInput)
    .output(AuthResponse)
    .mutation(async ({ input }) => {
      const userWithPassword = await UserRepo.findByEmail(input.email)
      if (!userWithPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }

      const isValidPassword = await UserRepo.verifyPassword(userWithPassword, input.password)
      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password',
        })
      }

      // Return user without password
      const user = await UserRepo.findById(userWithPassword.id)
      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User not found',
        })
      }

      const token = generateToken(user)
      return { user, token }
    }),

  // Feed routes
  feed: t.procedure
    .input(z.object({ cursor: z.string().nullish(), limit: z.number().min(1).max(50).default(20) }))
    .output(z.object({ items: z.array(FeedItem), nextCursor: z.string().nullish() }))
    .query(async ({ input }) => {
      return FeedRepo.getLatest({ cursor: input.cursor ?? null, limit: input.limit })
    }),

  // Protected routes
  saveItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await FeedRepo.saveForUser({ userId: ctx.user.id, itemId: input.itemId })
      return { ok: true }
    }),

  savedItems: protectedProcedure
    .input(z.object({ cursor: z.string().nullish(), limit: z.number().min(1).max(50).default(20) }))
    .output(z.object({ items: z.array(FeedItem), nextCursor: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      return FeedRepo.getSavedItems({ 
        userId: ctx.user.id, 
        cursor: input.cursor ?? null, 
        limit: input.limit 
      })
    }),

  personalizedFeed: protectedProcedure
    .input(z.object({ cursor: z.string().nullish(), limit: z.number().min(1).max(50).default(20) }))
    .output(z.object({ items: z.array(FeedItem), nextCursor: z.string().nullish() }))
    .query(async ({ input, ctx }) => {
      return FeedRepo.getPersonalizedFeed({ 
        userId: ctx.user.id, 
        cursor: input.cursor ?? null, 
        limit: input.limit 
      })
    }),

  me: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.user
    }),
})

export type AppRouter = typeof appRouter


