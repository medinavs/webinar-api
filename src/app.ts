import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import betterAuthPlugin from './infrastructure/http/plugins/better-auth-plugin'
import { registerRoutes } from './infrastructure/http/decorators/route-decorator'
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { env } from './infrastructure/config/env'
import { routes } from './modules/content/http/routes'

export const app = fastify({
    logger: {
        enabled: false,
    }
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(betterAuthPlugin)

app.register(fastifyCors, {
    origin: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Credentials',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Cookie'
    ],
    credentials: true,
    exposedHeaders: ['Set-Cookie']
})

app.get('/health', async () => {
    return { name: 'tractian-webinar-api', status: 'OK' }
})

registerRoutes(app, routes)

app.register(fastifySwagger, {
    swagger: {
        info: {
            title: 'tractian-webinar-api',
            description: 'API for Webinar Platform',
            version: '1.0.0'
        },
        host: 'localhost:3000',
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Webinars', description: 'Webinars endpoints' },
            { name: 'Categories', description: 'Categories endpoints' }
        ],
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            },
            Cookie: {
                type: 'apiKey',
                name: 'Cookie',
                in: 'header'
            }
        }
    }
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (request, reply, next) { next() },
        preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
})


app.setErrorHandler((error, req, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.code(400).send({
            error: 'Response Validation Error',
            message: "Request doesn't match the schema",
            statusCode: 400,
            details: {
                issues: error.validation,
                method: req.method,
                url: req.url,
            },
        });
    }

    if (isResponseSerializationError(error)) {
        return reply.code(500).send({
            error: 'Internal Server Error',
            message: "Response doesn't match the schema",
            statusCode: 500,
            details: {
                issues: error.cause.issues,
                method: error.method,
                url: error.url,
            },
        });
    }

    if (env.ENV !== 'prod') {
        console.error(error)
    } else {
        console.error('[Production Error]', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        })
    }

    return reply.status(500).send({ message: 'Internal server error.' })
})