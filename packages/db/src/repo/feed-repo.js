import { prisma } from '../client';
export class FeedRepo {
    static async upsertMany(items) {
        return Promise.all(items.map((item) => prisma.feedItem.upsert({
            where: { id: item.id },
            update: {
                title: item.title,
                url: item.url,
                imageUrl: item.imageUrl,
                source: item.source,
                price: item.price ?? null,
                tags: JSON.stringify(item.tags),
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
                tags: JSON.stringify(item.tags),
                publishedAt: item.publishedAt,
                summary: item.summary ?? null,
            },
        })));
    }
    static async getLatest(params) {
        const items = await prisma.feedItem.findMany({
            take: params.limit,
            orderBy: { publishedAt: 'desc' },
            ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {}),
        });
        const nextCursor = items.length === params.limit ? items[items.length - 1]?.id ?? null : null;
        return { items, nextCursor };
    }
    static async saveForUser(params) {
        await prisma.userSavedItem.upsert({
            where: { userId_itemId: { userId: params.userId, itemId: params.itemId } },
            update: {},
            create: { userId: params.userId, itemId: params.itemId },
        });
    }
    static async getSavedItems(params) {
        const savedItems = await prisma.userSavedItem.findMany({
            where: { userId: params.userId },
            include: {
                item: true,
            },
            take: params.limit,
            orderBy: { item: { publishedAt: 'desc' } },
            ...(params.cursor ? {
                skip: 1,
                cursor: { userId_itemId: { userId: params.userId, itemId: params.cursor } }
            } : {}),
        });
        const items = savedItems.map(savedItem => savedItem.item);
        const nextCursor = items.length === params.limit ? items[items.length - 1]?.id ?? null : null;
        return { items, nextCursor };
    }
    static async getPersonalizedFeed(params) {
        // Get user's saved items to understand preferences
        const savedItems = await prisma.userSavedItem.findMany({
            where: { userId: params.userId },
            include: { item: true },
            take: 20, // Sample for preference analysis
            orderBy: { item: { publishedAt: 'desc' } },
        });
        // Extract preferred sources and tags from saved items
        const preferredSources = [...new Set(savedItems.map(si => si.item.source))];
        const preferredTags = [...new Set(savedItems.flatMap(si => {
                try {
                    return si.item.tags;
                }
                catch {
                    return [];
                }
            }))].slice(0, 10); // Limit to top 10 tags
        // If user has preferences, prioritize content with those characteristics
        let whereClause = {};
        if (preferredSources.length > 0 || preferredTags.length > 0) {
            const orConditions = [];
            if (preferredSources.length > 0) {
                orConditions.push({ source: { in: preferredSources } });
            }
            if (preferredTags.length > 0) {
                // This is a simplified approach - in production you'd use full-text search
                orConditions.push({
                    tags: {
                        contains: preferredTags[0] // Just check for the first preferred tag as a simple example
                    }
                });
            }
            if (orConditions.length > 0) {
                whereClause = { OR: orConditions };
            }
        }
        // Get feed items with preference weighting
        const items = await prisma.feedItem.findMany({
            where: whereClause,
            take: params.limit,
            orderBy: { publishedAt: 'desc' },
            ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {}),
        });
        // If we don't have enough personalized items, fill with regular feed
        if (items.length < params.limit) {
            const remainingCount = params.limit - items.length;
            const existingIds = items.map(item => item.id);
            const additionalItems = await prisma.feedItem.findMany({
                where: existingIds.length > 0 ? { id: { notIn: existingIds } } : {},
                take: remainingCount,
                orderBy: { publishedAt: 'desc' },
                ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {}),
            });
            items.push(...additionalItems);
        }
        const nextCursor = items.length === params.limit ? items[items.length - 1]?.id ?? null : null;
        return { items, nextCursor };
    }
}
//# sourceMappingURL=feed-repo.js.map