import type { FeedItem } from '@techsplore/schemas';
export declare class FeedRepo {
    static upsertMany(items: Array<FeedItem>): Promise<{
        url: string;
        source: string;
        id: string;
        title: string;
        imageUrl: string | null;
        price: number | null;
        tags: string[];
        publishedAt: Date;
        summary: string | null;
    }[]>;
    static getLatest(params: {
        cursor: string | null;
        limit: number;
    }): Promise<{
        items: any[];
        nextCursor: string | null;
    }>;
    static saveForUser(params: {
        userId: string;
        itemId: string;
    }): Promise<void>;
}
