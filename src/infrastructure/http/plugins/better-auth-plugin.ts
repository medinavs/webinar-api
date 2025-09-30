import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { verifyAuthentication } from '../middlewares/verify-authentication'
import { auth } from '@/infrastructure/auth/better-auth'

declare module 'fastify' {
    interface FastifyRequest {
        user?: {
            id: string
            name: string
            email: string
        }
    }
}

async function betterAuthPlugin(fastify: FastifyInstance) {
    console.log("Registering better-auth plugin")

    fastify.route({
        method: ["GET", "POST"],
        url: "/api/auth/*",
        async handler(request, reply) {

            try {
                const url = new URL(request.url, `http://${request.headers.host}`)

                // Convert Fastify headers to standard Headers object
                const headers = new Headers()
                Object.entries(request.headers).forEach(([key, value]) => {
                    if (value) headers.append(key, value.toString())
                })

                // Create Fetch API-compatible request
                const req = new Request(url.toString(), {
                    method: request.method,
                    headers,
                    body: request.body ? JSON.stringify(request.body) : undefined,
                })

                // Process authentication request
                const response = await auth.handler(req)

                // Forward response to client
                reply.status(response.status)
                response.headers.forEach((value, key) => reply.header(key, value))

                const responseBody = response.body ? await response.text() : null
                reply.send(responseBody)
            } catch (error) {
                fastify.log.error(`Authentication Error: ${error instanceof Error ? error.message : String(error)}`)
                reply.status(500).send({
                    error: "Internal authentication error",
                    code: "AUTH_FAILURE"
                })
            }
        }
    })

    fastify.decorate('authenticate', verifyAuthentication)
}


export default fp(betterAuthPlugin)