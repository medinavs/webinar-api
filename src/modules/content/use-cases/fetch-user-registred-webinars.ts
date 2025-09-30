import { Webinar } from "@/shared/models/webinar";
import { WebinarRepository } from "../repositories/webinar-repository";

interface FetchUserRegistredWebinarsRequest {
    userId: string;
}

interface FetchUserRegistredWebinarsResponse {
    webinars: Webinar[];
}

export class FetchUserRegistredWebinarsUseCase {
    constructor(
        private readonly webinarRepository: WebinarRepository
    ) { }

    async execute(request: FetchUserRegistredWebinarsRequest): Promise<FetchUserRegistredWebinarsResponse> {
        const webinars = await this.webinarRepository.getUserRegistrations(request.userId);

        return { webinars };
    }
}