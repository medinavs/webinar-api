import { PrismaWebinarRepository } from "../../repositories/prisma/prisma-webinar-repository";
import { FetchRecentsWebinarsUseCase } from "../fetch-recents-webinars";

export function MakeFetchRecentsWebinars() {
    const webinarRepository = new PrismaWebinarRepository();

    const useCase = new FetchRecentsWebinarsUseCase(webinarRepository);

    return useCase;
}