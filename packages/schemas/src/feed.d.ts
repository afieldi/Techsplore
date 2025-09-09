import { z } from 'zod';
export declare const Source: z.ZodEnum<{
    amazon: "amazon";
    kickstarter: "kickstarter";
    drop: "drop";
    rss: "rss";
    other: "other";
}>;
export type Source = z.infer<typeof Source>;
export declare const FeedItem: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    url: z.ZodString;
    imageUrl: z.ZodOptional<z.ZodString>;
    source: z.ZodEnum<{
        amazon: "amazon";
        kickstarter: "kickstarter";
        drop: "drop";
        rss: "rss";
        other: "other";
    }>;
    price: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    publishedAt: z.ZodCoercedDate<unknown>;
    summary: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type FeedItem = z.infer<typeof FeedItem>;
