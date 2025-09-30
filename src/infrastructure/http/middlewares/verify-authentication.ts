import { auth } from "@/infrastructure/auth/better-auth"
import { AuthRequiredError, InvalidAuthError } from "@/shared/exceptions/auth"
import { FastifyReply, FastifyRequest } from "fastify"

export async function verifyAuthentication(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const authHeader = request.headers.authorization
        const cookieHeader = request.headers.cookie

        // create headers for session validation
        const headers = new Headers()
        if (authHeader) headers.append('authorization', authHeader)
        if (cookieHeader) headers.append('cookie', cookieHeader)

        const session = await auth.api.getSession({
            headers: headers
        })

        if (!session?.user) {
            reply.status(401).send(new AuthRequiredError())
            return
        }

        request.user = session.user
    } catch (error) {
        request.log.error(`Authentication Middleware Error: ${error instanceof Error ? error.message : String(error)}`)
        reply.status(401).send(new InvalidAuthError())
        return
    }
}
