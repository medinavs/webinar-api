import { PrismaWebinarRepository } from "../../repositories/prisma/prisma-webinar-repository";
import { FetchPopularsWebinarsUseCase } from "../fetch-populars-webinars";

export function MakeFetchPopularsWebinars() {
    const webinarRepository = new PrismaWebinarRepository();

    const useCase = new FetchPopularsWebinarsUseCase(webinarRepository);

    return useCase;
}