import { Route } from "@/infrastructure/http/decorators/route-decorator";
import { MakeFetchCategories } from "../../use-cases/factories/make-fetch-categories";
import type { FastifyReply, FastifyRequest } from "fastify";

export class CategoryController {
    constructor() { }

    @Route('GET', '/categories')
    async getCategories(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const useCase = MakeFetchCategories();

            const { categories } = await useCase.execute();

            reply.status(200).send({ categories });
        } catch (error) {
            if (error instanceof Error)
                reply.status(500).send({ error: error.message || 'Internal server error' });
        }
    }
}