import { Route } from "@/infrastructure/http/decorators/route-decorator";
import { MakeFetchWebinars } from "../../use-cases/factories/make-fetch-webinars";
import type { FastifyReply, FastifyRequest } from "fastify";
import { MakeGetWebinar } from "../../use-cases/factories/make-get-webinar";
import { MakeFetchUserRegistredWebinars } from "../../use-cases/factories/make-fetch-user-registred-webinars";
import { verifyAuthentication } from "@/infrastructure/http/middlewares/verify-authentication";
import { MakeCreateRegistration } from "../../use-cases/factories/make-create-registration";
import { HasUserAlreadyRegisteredError, UserRegistrationError } from "@/shared/exceptions/user";
import { WebinarNotFoundError } from "@/shared/exceptions/webinar";

export class WebinarController {
    constructor() { }

    @Route('GET', '/webinars')
    async getWebinars(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { category, language, speakerId, dateFrom, dateTo, search } = request.query as {
                category?: string;
                language?: string;
                speakerId?: string;
                dateFrom?: Date;
                dateTo?: Date;
                search?: string;
            }

            const useCase = MakeFetchWebinars();
            const { webinars } = await useCase.execute({
                filters: {
                    category,
                    dateFrom: dateFrom ? new Date(String(dateFrom)) : undefined,
                    dateTo: dateTo ? new Date(String(dateTo)) : undefined,
                    language,
                    speakerId,
                    search,
                }
            });


            reply.status(200).send({ webinars });
        } catch (error) {
            if (error instanceof Error)
                reply.status(500).send({ error: error.message || 'Internal server error' });
        }
    }

    @Route('GET', '/webinars/:id')
    async getWebinarById(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { id } = request.params as { id: string };
            const useCase = MakeGetWebinar();

            const { webinar } = await useCase.execute({ id });

            reply.status(200).send({ webinar });
        } catch (error) {
            if (error instanceof WebinarNotFoundError) {
                reply.status(404).send({ error: error.message });
                return;
            }

            if (error instanceof Error)
                reply.status(500).send({ error: error.message || 'Internal server error' });
        }
    }

    @Route('GET', '/webinars/registered/:userId')
    async getRegisteredWebinars(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { userId } = request.params as { userId: string };
            const useCase = MakeFetchUserRegistredWebinars();

            const { webinars } = await useCase.execute({ userId });

            reply.status(200).send({ webinars });
        } catch (error) {
            if (error instanceof Error)
                reply.status(500).send({ error: error.message || 'Internal server error' });
        }
    }

    @Route('POST', '/webinars/:webinarId/registrations', {
        middlewares: [verifyAuthentication],
    })
    async createWebinar(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const { webinarId } = request.params as { webinarId: string };

            const { name, email, linkedinURL } = request.body as { name: string; email: string; linkedinURL: string };

            const useCase = MakeCreateRegistration();

            await useCase.execute({
                webinarId: webinarId,
                userId: request.user!.id,
                email: email,
                name: name,
                linkedinURL: linkedinURL,
            });

            reply.status(201).send({ message: 'Registration created successfully' });
        } catch (error) {
            if (error instanceof HasUserAlreadyRegisteredError) {
                reply.status(409).send({ error: error.message });
            } else if (error instanceof UserRegistrationError) {
                reply.status(400).send({ error: error.message });
            } else if (error instanceof Error) {
                reply.status(500).send({ error: error.message || 'Internal server error' });
            }
        }
    }
}