import { prisma } from '../client'
import type { FeedItem } from '@techsplore/schemas'

export class FeedRepo {
  static async upsertMany(items: Array<FeedItem>) {
    return Promise.all(
      items.map((item) =>
        prisma.feedItem.upsert({
          where: { id: item.id },
          update: {
            title: item.title,
            url: item.url,
            imageUrl: item.imageUrl,
            source: item.source,
            price: item.price ?? null,
            tags: item.tags,
            publishedAt: item.publishedAt,
            summary: item.summary ?? null,
          },
          create: {
            id: item.id,
            title: item.title,
            url: item.url,
            imageUrl: item.imageUrl,
            source: item.source,
            price: item.price ?? null,
            tags: item.tags,
            publishedAt: item.publishedAt,
            summary: item.summary ?? null,
          },
        })
      )
    )
  }

  static async getLatest(params: { cursor: string | null; limit: number }) {
    const items = await prisma.feedItem.findMany({
      take: params.limit,
      orderBy: { publishedAt: 'desc' },
      ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {}),
    })
    const nextCursor = items.length === params.limit ? items[items.length - 1]?.id ?? null : null
    return { items, nextCursor } as { items: any[]; nextCursor: string | null }
  }

  static async saveForUser(params: { userId: string; itemId: string }) {
    await prisma.userSavedItem.upsert({
      where: { userId_itemId: { userId: params.userId, itemId: params.itemId } },
      update: {},
      create: { userId: params.userId, itemId: params.itemId },
    })
  }
}


