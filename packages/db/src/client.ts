import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

console.log('AAAAAA', process.env.DATABASE_URL)
export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL ?? ''
        }
    }
})


