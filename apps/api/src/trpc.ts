import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { FeedItem } from '@techsplore/schemas'
import { FeedRepo } from '@techsplore/db'

export const createContext = async () => {
  // TODO: add auth user when you integrate auth
  return { user: null as null | { id: string } }
}

const t = initTRPC.context<typeof createContext>().create()

export const appRouter = t.router({
  feed: t.procedure
    .input(z.object({ cursor: z.string().nullish(), limit: z.number().min(1).max(50).default(20) }))
    .output(z.object({ items: z.array(FeedItem), nextCursor: z.string().nullish() }))
    .query(async ({ input }) => {
      return FeedRepo.getLatest({ cursor: input.cursor ?? null, limit: input.limit })
    }),
  saveItem: t.procedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error('Unauthorized')
      await FeedRepo.saveForUser({ userId: ctx.user.id, itemId: input.itemId })
      return { ok: true }
    }),
})

export type AppRouter = typeof appRouter


