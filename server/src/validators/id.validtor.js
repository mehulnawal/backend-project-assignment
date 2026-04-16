import { z } from 'zod';
import mongoose from 'mongoose';

export const idValidator = z.object({
    id: z
        .string()
        .refine(val => mongoose.Types.ObjectId.isValid(val), {
            message: "Invalid object id"
        })
})