import { Webinar } from "@/shared/models/webinar";
import { WebinarRepository, CreateWebinarData, UpdateWebinarData, UserRegistred } from "../webinar-repository";
import { prisma } from "@/infrastructure/database/client";

export class PrismaWebinarRepository implements WebinarRepository {

    async findAll(filters?: {
        category?: string;
        speakerId?: string;
        dateFrom?: Date;
        dateTo?: Date;
        search?: string;
    }): Promise<Webinar[]> {
        const where: any = {};

        if (filters?.category) {
            where.category = filters.category;
        }

        if (filters?.speakerId) {
            where.speakerId = filters.speakerId;
        }

        if (filters?.dateFrom) {
            where.date = { ...where.date, gte: filters.dateFrom };
        }

        if (filters?.dateTo) {
            where.date = { ...where.date, lte: filters.dateTo };
        }

        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        const webinars = await prisma.webinar.findMany({
            where,
            include: {
                speaker: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        registrations: true
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        return webinars;
    }

    async findById(id: string): Promise<Webinar | null> {
        const webinar = await prisma.webinar.findUnique({
            where: { id },
            include: {
                speaker: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                registrations: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        registrations: true
                    }
                }
            }
        });

        return webinar;
    }

    async create(data: CreateWebinarData): Promise<Webinar> {
        const webinar = await prisma.webinar.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                duration: data.duration,
                imageUrl: data.imageUrl,
                link: data.link,
                category: data.category,
                speakerId: data.speakerId,
                language: data.language
            },
            include: {
                speaker: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                _count: {
                    select: {
                        registrations: true
                    }
                }
            }
        });

        return webinar;
    }

    async update(id: string, data: UpdateWebinarData): Promise<Webinar | null> {
        try {
            const webinar = await prisma.webinar.update({
                where: { id },
                data: {
                    ...(data.title && { title: data.title }),
                    ...(data.description && { description: data.description }),
                    ...(data.date && { date: data.date }),
                    ...(data.duration && { duration: data.duration }),
                    ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
                    ...(data.link !== undefined && { link: data.link }),
                    ...(data.category && { category: data.category })
                },
                include: {
                    speaker: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    },
                    _count: {
                        select: {
                            registrations: true
                        }
                    }
                }
            });

            return webinar;
        } catch (error) {
            return null;
        }
    }

    async delete(id: string): Promise<void> {
        await prisma.webinar.delete({
            where: { id }
        });
    }

    async registerUser(
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
    }> {
        const registration = await prisma.webinarRegistration.upsert({
            where: {
                userId_webinarId: {
                    userId,
                    webinarId
                }
            },
            update: {},
            create: {
                user: {
                    connect: { id: userId }
                },
                webinar: {
                    connect: { id: webinarId }
                },
                name: name,
                email: email,
                linkedinURL: linkedinURL,
            },
            select: {
                id: true,
                name: true,
                email: true,
                linkedinURL: true,
            }
        });

        return registration
    }

    async unregisterUser(webinarId: string, userId: string): Promise<void> {
        await prisma.webinarRegistration.deleteMany({
            where: {
                userId,
                webinarId
            }
        });
    }

    async isUserRegistered(webinarId: string, userId: string): Promise<boolean> {
        const registration = await prisma.webinarRegistration.findUnique({
            where: {
                userId_webinarId: {
                    userId,
                    webinarId
                }
            }
        });

        return !!registration;
    }

    async getRegisteredUsers(webinarId: string): Promise<UserRegistred[]> {
        const registrations = await prisma.webinarRegistration.findMany({
            where: { webinarId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        });

        return registrations.map(registration => registration.user);
    }

    async getUserRegistrations(userId: string): Promise<Webinar[]> {
        const registrations = await prisma.webinarRegistration.findMany({
            where: { userId },
            include: {
                webinar: {
                    include: {
                        speaker: {
                            select: {
                                id: true,
                                name: true,
                                image: true
                            }
                        },
                        _count: {
                            select: {
                                registrations: true
                            }
                        }
                    }
                },
            },
            orderBy: {
                webinar: {
                    date: 'desc'
                }
            }
        });

        return registrations.map(registration => ({
            ...registration.webinar,
            registrationDate: registration.createdAt
        }));
    }

    async getRegistrationCount(webinarId: string): Promise<number> {
        const count = await prisma.webinarRegistration.count({
            where: { webinarId }
        });

        return count;
    }
}