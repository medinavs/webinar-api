import { Webinar } from "@/shared/models/webinar";
import { WebinarRepository } from "../repositories/webinar-repository";

export class FetchRecentsWebinarsUseCase {
    constructor(private webinarRepository: WebinarRepository) { }

    async execute(): Promise<Webinar[]> {
        const webinars = this.webinarRepository.findRecentsWebinars();

        return webinars;
    }
}