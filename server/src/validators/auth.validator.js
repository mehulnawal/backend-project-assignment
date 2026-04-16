import { z } from 'zod';

export const authLoginValidation = z.object({

    email: z
        .string()
        .email()
        .trim(),

    password: z
        .string()
        .refine(value => /^(?=.*[A-Z]{1,})(?=.*[a-z]{1,})(?=.*\d{1,}).{6,}$/.test(value), {
            message: 'Password must include one uppercase, one lowercase and number and min length should be 6 characters'
        })
})

export const authRegisterDataValidation = authLoginValidation.extend({

    name: z
        .string()
        .trim()
        .min(3, { message: 'Name must be at least 3 characters' }),

})