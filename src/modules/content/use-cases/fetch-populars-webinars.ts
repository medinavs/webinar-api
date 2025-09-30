import { Webinar } from "@/shared/models/webinar";
import { WebinarRepository } from "../repositories/webinar-repository";

export class FetchPopularsWebinarsUseCase {
    constructor(private webinarRepository: WebinarRepository) { }

    async execute(): Promise<Webinar[]> {
        const webinars = await this.webinarRepository.findPopulars();
        return webinars;
    }
}