
export interface Webinar {
    id: string;
    title: string;
    description: string;
    date: Date;
    duration: number;
    imageUrl: string | null;
    link: string | null;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    speakerId: string;
    speaker: {
        id: string;
        name: string;
        image: string | null;
    };
    registrations?: {
        id: string;
        userId: string;
        user: {
            id: string;
            name: string;
            image: string | null;
        };
    }[];
    _count?: {
        registrations: number;
    };
}