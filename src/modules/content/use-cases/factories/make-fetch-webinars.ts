import { PrismaWebinarRepository } from "../../repositories/prisma/prisma-webinar-repository";
import { FetchWebinarsUseCase } from "../fetch-webinars";

export function MakeFetchWebinars() {
    const webinarRepository = new PrismaWebinarRepository()

    const useCase = new FetchWebinarsUseCase(webinarRepository)

    return useCase
}