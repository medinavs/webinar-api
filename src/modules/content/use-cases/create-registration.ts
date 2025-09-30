import { HasUserAlreadyRegisteredError, UserRegistrationError } from "@/shared/exceptions/user";
import { WebinarRepository } from "../repositories/webinar-repository";

interface CreateRegistrationRequest {
    webinarId: string;
    userId: string;
    name: string;
    email: string;
    linkedinURL: string;
}

interface CreateRegistrationResponse {
    success: boolean;
}

export class CreateRegistrationUseCase {
    constructor(
        private webinarsRepository: WebinarRepository,
    ) { }

    async execute(data: CreateRegistrationRequest): Promise<CreateRegistrationResponse> {
        const { webinarId, userId, name, email, linkedinURL } = data;

        const hasUserAlreadyRegistered = await this.webinarsRepository.isUserRegistered(webinarId, userId);

        if (hasUserAlreadyRegistered) {
            throw new HasUserAlreadyRegisteredError();
        }

        const registration = await this.webinarsRepository.registerUser(
            webinarId,
            userId,
            name,
            email,
            linkedinURL
        );

        if (!registration) {
            throw new UserRegistrationError();
        }

        return { success: true };
    }
}