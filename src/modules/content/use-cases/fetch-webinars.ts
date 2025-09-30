import { Webinar } from "@/shared/models/webinar";
import { WebinarRepository } from "../repositories/webinar-repository";

interface FetchWebinarsRequest {
    filters?: {
        category?: string;
        language?: string;
        dateFrom?: Date;
        dateTo?: Date;
        speakerId?: string;
        search?: string;
    };
}

interface FetchWebinarsResponse {
    webinars: Webinar[];
}

export class FetchWebinarsUseCase {
    constructor(
        private readonly webinarRepository: WebinarRepository
    ) { }

    async execute(request: FetchWebinarsRequest): Promise<FetchWebinarsResponse> {
        const webinars = await this.webinarRepository.findAll(request.filters);

        return { webinars };
    }
}