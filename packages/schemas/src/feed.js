import { z } from 'zod';
export const Source = z.enum(['amazon', 'kickstarter', 'drop', 'rss', 'other']);
export const FeedItem = z.object({
    id: z.string(),
    title: z.string(),
    url: z.string().url(),
    imageUrl: z.string().url().optional(),
    source: Source,
    price: z.number().optional(),
    tags: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    summary: z.string().optional(),
});
