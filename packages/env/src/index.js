import { z } from 'zod';
const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(4000),
    DATABASE_URL: z.string().url().optional(),
});
export function loadEnv(raw = process.env) {
    const parsed = EnvSchema.safeParse(raw);
    if (!parsed.success) {
        const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('\n');
        throw new Error(`Invalid environment variables:\n${issues}`);
    }
    const data = parsed.data;
    return {
        NODE_ENV: data.NODE_ENV,
        PORT: Number(data.PORT),
        DATABASE_URL: data.DATABASE_URL,
    };
}
