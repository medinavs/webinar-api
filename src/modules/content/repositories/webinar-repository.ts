import { Webinar } from "@/shared/models/webinar";

export interface WebinarRepository {
    findAll(filters?: {
        category?: string;
        language?: string;
        dateFrom?: Date;
        dateTo?: Date;
        speakerId?: string;
    }): Promise<Webinar[]>;

    findRecentsWebinars(): Promise<Webinar[]>;

    findPopulars(): Promise<Webinar[]>;

    findById(id: string): Promise<Webinar | null>;

    create(data: CreateWebinarData): Promise<Webinar>;

    update(id: string, data: UpdateWebinarData): Promise<Webinar | null>;

    delete(id: string): Promise<void>;

    registerUser(
        webinarId: string,
        userId: string,
        name: string,
        email: string,
        linkedinURL: string
    ): Promise<{
        id: string;
        name: string;
        email: string;
        linkedinURL: string;
    }>;

    isUserRegistered(webinarId: string, userId: string): Promise<boolean>;

    getRegisteredUsers(webinarId: string): Promise<UserRegistred[]>;

    getUserRegistrations(userId: string, search?: string): Promise<Webinar[]>;

    getRegistrationCount(webinarId: string): Promise<number>;
}

export interface UserRegistred {
    id: string;
    name: string;
    image: string | null;
}

export interface CreateWebinarData {
    title: string;
    description: string;
    date: Date;
    duration: number;
    imageUrl?: string;
    language: string;
    link?: string;
    category: string;
    speakerId: string;
}

export interface UpdateWebinarData {
    title?: string;
    description?: string;
    date?: Date;
    duration?: number;
    imageUrl?: string;
    link?: string;
    category?: string;
}