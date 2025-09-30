import { PrismaWebinarRepository } from "../../repositories/prisma/prisma-webinar-repository";
import { GetWebinarUseCase } from "../get-webinar";

export function MakeGetWebinar() {
    const webinarRepository = new PrismaWebinarRepository();

    const useCase = new GetWebinarUseCase(webinarRepository);

    return useCase;
}