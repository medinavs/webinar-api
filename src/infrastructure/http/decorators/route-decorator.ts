import { FastifyInstance, onRequestHookHandler } from 'fastify';

type RouteOptions = {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    schema?: object;
    middlewares?: onRequestHookHandler[]
};

const routes: { target: any; options: RouteOptions; handlerName: string }[] = [];

export function Route(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options?: {
        schema?: object;
        middlewares?: onRequestHookHandler[];
    }
) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        if (!descriptor || typeof descriptor.value !== 'function') {
            throw new Error('@Route deve ser usado em métodos.');
        }

        routes.push({
            target: target.constructor.prototype,
            options: {
                method,
                path,
                schema: options?.schema,
                middlewares: options?.middlewares,
            },
            handlerName: propertyKey as string,
        });
    };
}

export function registerRoutes(fastify: FastifyInstance, controllers: any[]) {
    for (const controller of controllers) {
        for (const route of routes) {
            if (Object.getPrototypeOf(controller) === route.target) {
                const { options, handlerName } = route;
                const handler = controller[handlerName].bind(controller);

                fastify.route({
                    method: options.method,
                    url: options.path,
                    schema: options.schema,
                    onRequest: options.middlewares,
                    handler,
                });

                console.log(`Rota registrada: ${options.method} ${options.path}`);
            }
        }
    }
}