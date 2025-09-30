import { PrismaWebinarRepository } from "../../repositories/prisma/prisma-webinar-repository";
import { CreateRegistrationUseCase } from "../create-registration";

export function MakeCreateRegistration() {
    const webinarRepository = new PrismaWebinarRepository();

    const useCase = new CreateRegistrationUseCase(webinarRepository);

    return useCase;
}