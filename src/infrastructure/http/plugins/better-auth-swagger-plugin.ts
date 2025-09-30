import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

async function betterAuthSwaggerPlugin(fastify: FastifyInstance) {
    fastify.addSchema({
        $id: 'user',
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            emailVerified: { type: 'boolean' },
            image: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    })

    fastify.addSchema({
        $id: 'session',
        type: 'object',
        properties: {
            token: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' },
            userId: { type: 'string' },
            user: { $ref: 'user#' }
        }
    })

    const authRoutes = [
        {
            method: 'POST',
            path: '/api/auth/sign-up',
            schema: {
                description: 'Create a new user account',
                tags: ['Auth'],
                body: {
                    type: 'object',
                    required: ['email', 'password', 'name'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', minLength: 8 },
                        name: { type: 'string' }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            user: { $ref: 'user#' },
                            session: { $ref: 'session#' }
                        }
                    },
                    400: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/api/auth/sign-in',
            schema: {
                description: 'Sign in with email and password',
                tags: ['Auth'],
                body: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string' }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            user: { $ref: 'user#' },
                            session: { $ref: 'session#' }
                        }
                    },
                    401: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/api/auth/sign-out',
            schema: {
                description: 'Sign out current user',
                tags: ['Auth'],
                security: [{ Cookie: [] }],
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' }
                        }
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/api/auth/session',
            schema: {
                description: 'Get current user session',
                tags: ['Auth'],
                security: [{ Cookie: [] }],
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            user: { $ref: 'user#' },
                            session: { $ref: 'session#' }
                        }
                    },
                    401: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/api/auth/forget-password',
            schema: {
                description: 'Request password reset',
                tags: ['Auth'],
                body: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string', format: 'email' }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                            message: { type: 'string' }
                        }
                    }
                }
            }
        },
        {
            method: 'POST',
            path: '/api/auth/reset-password',
            schema: {
                description: 'Reset password with token',
                tags: ['Auth'],
                body: {
                    type: 'object',
                    required: ['token', 'password'],
                    properties: {
                        token: { type: 'string' },
                        password: { type: 'string', minLength: 8 }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' }
                        }
                    },
                    400: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                            message: { type: 'string' }
                        }
                    }
                }
            }
        }
    ]

    authRoutes.forEach(route => {
        fastify.route({
            method: route.method as any,
            url: route.path,
            schema: route.schema,
            handler: async () => {
                return { message: 'This route is handled by Better Auth' }
            }
        })
    })
}

export default fp(betterAuthSwaggerPlugin)