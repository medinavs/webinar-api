import { z } from 'zod';

export const registerWebinarParamsSchema = z.object({
    webinarId: z.string(),
});

export const registerWebinarBodySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required'),
    linkedinURL: z.string().optional(),
});