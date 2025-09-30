import { Webinar } from "@/shared/models/webinar";
import { WebinarRepository } from "../repositories/webinar-repository";
import { WebinarNotFoundError } from "@/shared/exceptions/webinar";

interface GetWebinarRequest {
    id: string;
}

interface GetWebinarResponse {
    webinar: Webinar;
}

export class GetWebinarUseCase {
    constructor(
        private readonly webinarRepository: WebinarRepository
    ) { }

    async execute(request: GetWebinarRequest): Promise<GetWebinarResponse> {
        const webinar = await this.webinarRepository.findById(request.id);

        if (!webinar) {
            throw new WebinarNotFoundError();
        }

        return { webinar };
    }
}