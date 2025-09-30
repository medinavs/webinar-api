import { PrismaWebinarRepository } from "../../repositories/prisma/prisma-webinar-repository";
import { FetchUserRegistredWebinarsUseCase } from "../fetch-user-registred-webinars";

export function MakeFetchUserRegistredWebinars() {
    const webinarRepository = new PrismaWebinarRepository();

    const useCase = new FetchUserRegistredWebinarsUseCase(webinarRepository);

    return useCase;
}