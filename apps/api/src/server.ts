import Fastify from 'fastify'
import cors from '@fastify/cors'
import { loadEnv } from '@techsplore/env'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter, createContext } from './trpc'

async function buildServer() {
  const env = loadEnv()
  const app = Fastify({ logger: true })
  await app.register(cors, { origin: true })

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  })

  app.get('/health', async () => ({ ok: true }))

  return { app, env }
}

async function main() {
  const { app, env } = await buildServer()
  await app.listen({ port: env.PORT, host: '0.0.0.0' })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


