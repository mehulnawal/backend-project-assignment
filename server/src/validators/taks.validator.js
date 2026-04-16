import { z } from 'zod';

export const taskValidator = z.object({

    title: z.
        string()
        .trim()
        .min(3, "Title must be at least 3 characters long")
        .refine(val => /^[a-zA-Z- ]+$/.test(val), {
            message: "Title can only contain letters, hyphens, and spaces"
        }),

    description: z.
        string()
        .trim()
        .min(5, "Description must be at least 5 characters long"),

})